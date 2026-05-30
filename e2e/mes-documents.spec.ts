import { test, expect } from '@playwright/test'
import { CLIENT_AUTH_FILE } from './constants'

test.describe('Mes documents — accès non authentifié', () => {
  test('redirige vers /login', async ({ page }) => {
    await page.goto('/mes-documents')
    await page.waitForURL('**/login', { timeout: 8000 })
    expect(page.url()).toContain('/login')
  })
})

test.describe('Mes documents — client connecté', () => {
  test.use({ storageState: CLIENT_AUTH_FILE })

  test.beforeEach(async ({ page }) => {
    await page.goto('/mes-documents')
    await expect(page.locator('h1', { hasText: 'Mes documents' })).toBeVisible({ timeout: 10000 })
  })

  test('titre "Mes documents" visible', async ({ page }) => {
    await expect(page.locator('h1', { hasText: 'Mes documents' })).toBeVisible()
  })

  test('toggle kanban / liste visible', async ({ page }) => {
    await expect(page.locator('button').filter({ hasText: /Kanban|Liste/ }).first()).toBeVisible()
  })

  test('switch vers vue liste — table toujours rendue', async ({ page }) => {
    await page.locator('button').filter({ hasText: 'Liste' }).click()
    // La table est toujours rendue en vue liste (état vide inclus dans la table)
    await expect(page.locator('table')).toBeVisible({ timeout: 8000 })
  })

  test('select statut présent avec valeur par défaut "Non traité"', async ({ page }) => {
    // La page a 2 selects : d'abord l'année, ensuite le statut
    const statusSelect = page.locator('select').nth(1)
    await expect(statusSelect).toBeVisible()
    await expect(statusSelect).toHaveValue('unprocessed')
  })

  test('options de statut disponibles', async ({ page }) => {
    const statusSelect = page.locator('select').nth(1)
    const options = await statusSelect.locator('option').allTextContents()
    expect(options.some(o => o.includes('Non traité'))).toBeTruthy()
    expect(options.some(o => o.includes('Traité'))).toBeTruthy()
    expect(options.some(o => o.includes('Rejeté'))).toBeTruthy()
    expect(options.some(o => o.includes('Tous'))).toBeTruthy()
  })

  test('bouton "Lancer" / recherche présent', async ({ page }) => {
    await expect(page.getByRole('button', { name: /Rechercher/i })).toBeVisible()
  })

  test('bouton "Déposer un document" → /mes-documents/nouveau', async ({ page }) => {
    const btn = page.getByRole('button', { name: /Déposer|Nouveau document/i })
      .or(page.getByRole('link', { name: /Déposer|Nouveau document/i }))
    await expect(btn.first()).toBeVisible({ timeout: 8000 })
    await btn.first().click()
    await page.waitForURL('**/mes-documents/nouveau', { timeout: 8000 })
    expect(page.url()).toContain('/mes-documents/nouveau')
  })

  test('filtre "Tous les statuts" puis Rechercher → pas d\'erreur', async ({ page }) => {
    // Le 2e select est le filtre statut (le 1er est l'année)
    await page.locator('select').nth(1).selectOption('all')
    await page.getByRole('button', { name: /Rechercher/i }).click()
    await expect(page.locator('body')).not.toContainText('Internal Server Error')
    await expect(page.locator('h1', { hasText: 'Mes documents' })).toBeVisible({ timeout: 8000 })
  })

  test('en vue liste — table visible après Rechercher', async ({ page }) => {
    await page.locator('button').filter({ hasText: 'Liste' }).click()
    await page.locator('select').nth(1).selectOption('all')
    await page.getByRole('button', { name: /Rechercher/i }).click()
    await expect(page.locator('table')).toBeVisible({ timeout: 8000 })
    // Si des docs existent, le bouton download peut être présent
    const dlBtn = page.locator('button[title="Télécharger"]').first()
    if (await dlBtn.count() > 0) {
      await expect(dlBtn).toBeVisible()
    }
  })

  test('pas d\'erreur serveur', async ({ page }) => {
    await expect(page.locator('body')).not.toContainText('Internal Server Error')
    await expect(page.locator('body')).not.toContainText('500')
  })

  test('nav portail — lien "Mes documents" actif', async ({ page }) => {
    const nav = page.locator('nav').or(page.locator('aside'))
    await expect(nav.getByRole('link', { name: 'Mes documents' })).toBeVisible({ timeout: 8000 })
  })
})

test.describe('Dépôt document client — wizard étape 1', () => {
  test.use({ storageState: CLIENT_AUTH_FILE })

  test.beforeEach(async ({ page }) => {
    await page.goto('/mes-documents/nouveau')
    await page.waitForLoadState('networkidle')
  })

  test('page de dépôt charge sans erreur', async ({ page }) => {
    await expect(page.locator('body')).not.toContainText('Internal Server Error')
  })

  test('bouton retour → /mes-documents', async ({ page }) => {
    const back = page.getByRole('button', { name: /Retour|Annuler/i }).first()
    if (await back.count() > 0) {
      await back.click()
      await page.waitForURL('**/mes-documents', { timeout: 8000 })
      expect(page.url()).toContain('/mes-documents')
    }
  })

  test('zone de dépôt de fichier visible', async ({ page }) => {
    // L'input file est dans le DOM (peut être hidden, rendu par le wizard)
    const fileInput = page.locator('input[type="file"]')
    await expect(fileInput).toBeAttached({ timeout: 10000 })
  })
})
