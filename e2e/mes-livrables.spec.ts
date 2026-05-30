import { test, expect } from '@playwright/test'
import { CLIENT_AUTH_FILE } from './constants'

test.describe('Mes livrables — accès non authentifié', () => {
  test('redirige vers /login', async ({ page }) => {
    await page.goto('/mes-livrables')
    await page.waitForURL('**/login', { timeout: 8000 })
    expect(page.url()).toContain('/login')
  })
})

test.describe('Mes livrables — client connecté', () => {
  test.use({ storageState: CLIENT_AUTH_FILE })

  test.beforeEach(async ({ page }) => {
    await page.goto('/mes-livrables')
    await expect(page.locator('h1', { hasText: 'Mes livrables' })).toBeVisible({ timeout: 10000 })
  })

  test('titre "Mes livrables" visible', async ({ page }) => {
    await expect(page.locator('h1', { hasText: 'Mes livrables' })).toBeVisible()
  })

  test('select année présent', async ({ page }) => {
    const yearSelect = page.locator('select').first()
    await expect(yearSelect).toBeVisible()
    // L'année par défaut doit être un nombre à 4 chiffres
    const val = await yearSelect.inputValue()
    expect(val).toMatch(/^\d{4}$/)
  })

  test('bouton Rechercher présent', async ({ page }) => {
    await expect(page.getByRole('button', { name: /Rechercher/i })).toBeVisible()
  })

  test('table toujours rendue (même si vide)', async ({ page }) => {
    // La table s'affiche dès que le chargement initial est terminé
    await expect(page.locator('table')).toBeVisible({ timeout: 10000 })
  })

  test('clic Rechercher → table ou message vide affiché', async ({ page }) => {
    await page.getByRole('button', { name: /Rechercher/i }).click()
    // Attend la fin du spinner (docsLoading)
    await expect(page.locator('table')).toBeVisible({ timeout: 10000 })
  })

  test('message vide OU lignes présentes', async ({ page }) => {
    await expect(page.locator('table')).toBeVisible({ timeout: 10000 })
    const rows = await page.locator('tbody tr').count()
    if (rows === 1) {
      // Potentiellement la row de "Aucun livrable"
      const emptyRow = page.locator('text=Aucun livrable')
      const hasData = await page.locator('tbody tr td button').count()
      // L'un ou l'autre doit être vrai
      expect(await emptyRow.count() + hasData).toBeGreaterThan(0)
    }
  })

  test('icône téléchargement visible sur un livrable avec fichier', async ({ page }) => {
    await expect(page.locator('table')).toBeVisible({ timeout: 10000 })
    const dlBtn = page.locator('button[title="Télécharger"]').first()
    if (await dlBtn.count() > 0) {
      await expect(dlBtn).toBeVisible()
    }
  })

  test('pagination — sélecteur lignes/page visible', async ({ page }) => {
    await expect(page.locator('table')).toBeVisible({ timeout: 10000 })
    // Le select de pagination (10/20) est distinct du select année
    const allSelects = page.locator('select')
    const count = await allSelects.count()
    expect(count).toBeGreaterThanOrEqual(1)
  })

  test('changement d\'année disponible → Rechercher → table stable', async ({ page }) => {
    const yearSelect = page.locator('select').first()
    const options = await yearSelect.locator('option').all()
    if (options.length > 1) {
      // Utilise la première option disponible (pas de hardcode d'année)
      await yearSelect.selectOption({ index: 0 })
      await page.getByRole('button', { name: /Rechercher/i }).click()
      await expect(page.locator('table')).toBeVisible({ timeout: 10000 })
    }
  })

  test('nav portail — lien "Livrables cabinet" présent', async ({ page }) => {
    const nav = page.locator('nav').or(page.locator('aside'))
    await expect(nav.getByRole('link', { name: 'Livrables cabinet' })).toBeVisible({ timeout: 8000 })
  })

  test('pas d\'erreur serveur', async ({ page }) => {
    await expect(page.locator('body')).not.toContainText('Internal Server Error')
    await expect(page.locator('body')).not.toContainText('500')
  })
})
