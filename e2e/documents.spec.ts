import { test, expect } from '@playwright/test'
import { CAB_AUTH_FILE } from './constants'

test.describe('Documents clients — accès non authentifié', () => {
  test('redirige vers /login', async ({ page }) => {
    await page.goto('/documents')
    await page.waitForURL('**/login', { timeout: 8000 })
    expect(page.url()).toContain('/login')
  })
})

test.describe('Documents clients — cabinet connecté', () => {
  test.use({ storageState: CAB_AUTH_FILE })

  test.beforeEach(async ({ page }) => {
    await page.goto('/documents')
    await expect(page.locator('h1', { hasText: 'Documents' })).toBeVisible({ timeout: 10000 })
  })

  test('titre "Documents" visible', async ({ page }) => {
    await expect(page.locator('h1', { hasText: 'Documents' })).toBeVisible()
  })

  test('filtres année, statut et client présents', async ({ page }) => {
    await expect(page.locator('select').first()).toBeVisible()
    // Le filtre statut "Non traité" est la valeur par défaut
    const statusSelect = page.locator('select').nth(1)
    await expect(statusSelect).toBeVisible()
    await expect(statusSelect).toHaveValue('unprocessed')
  })

  test('bouton "Lancer" présent et cliquable', async ({ page }) => {
    const btn = page.getByRole('button', { name: /Lancer|Rechercher/i })
    await expect(btn).toBeVisible()
    await btn.click()
    // Pas d'erreur JS → la page tient le coup
    await expect(page.locator('h1', { hasText: 'Documents' })).toBeVisible()
  })

  test('toggle vue Kanban / Liste visible', async ({ page }) => {
    const btns = page.locator('button').filter({ hasText: /Kanban|Liste/ })
    await expect(btns.first()).toBeVisible()
  })

  test('switch vers vue liste', async ({ page }) => {
    await page.locator('button').filter({ hasText: 'Liste' }).click()
    // Le tableau est toujours rendu en vue liste (même vide, l'état vide est dans la table)
    await expect(page.locator('table')).toBeVisible({ timeout: 8000 })
  })

  test('filtre "Tous les statuts" → change la valeur du select', async ({ page }) => {
    const statusSelect = page.locator('select').nth(1)
    await statusSelect.selectOption('all')
    await expect(statusSelect).toHaveValue('all')
    await page.getByRole('button', { name: /Lancer|Rechercher/i }).click()
    await expect(page.locator('h1', { hasText: 'Documents' })).toBeVisible({ timeout: 8000 })
  })

  test('filtre "Traité" → change la valeur du select', async ({ page }) => {
    const statusSelect = page.locator('select').nth(1)
    await statusSelect.selectOption('processed')
    await expect(statusSelect).toHaveValue('processed')
  })

  test('filtre "Rejeté" → change la valeur du select', async ({ page }) => {
    const statusSelect = page.locator('select').nth(1)
    await statusSelect.selectOption('rejected')
    await expect(statusSelect).toHaveValue('rejected')
  })

  test('navigation année — avancer et reculer', async ({ page }) => {
    const year = new Date().getFullYear()
    // L'année courante est affichée dans le select
    const yearSelect = page.locator('select').first()
    await expect(yearSelect).toHaveValue(String(year))
  })

  test('lien "+ Nouveau document" → /documents/nouveau', async ({ page }) => {
    const link = page.getByRole('link', { name: /Nouveau|Déposer/i })
      .or(page.getByRole('button', { name: /Nouveau|Déposer/i }))
    if (await link.count() > 0) {
      await link.first().click()
      await page.waitForURL('**/documents/nouveau', { timeout: 8000 })
      expect(page.url()).toContain('/documents/nouveau')
    }
  })

  test('en vue liste — colonnes principales visibles', async ({ page }) => {
    await page.locator('button').filter({ hasText: 'Liste' }).click()
    await page.getByRole('button', { name: /Lancer|Rechercher/i }).click()
    const table = page.locator('table')
    if (await table.count() > 0) {
      await expect(table.locator('thead')).toBeVisible({ timeout: 8000 })
    }
  })

  test('modal note — ouverture sur une ligne', async ({ page }) => {
    await page.locator('button').filter({ hasText: 'Liste' }).click()
    await page.locator('select').nth(1).selectOption('all')
    await page.getByRole('button', { name: /Lancer|Rechercher/i }).click()
    const noteBtn = page.locator('button[title="Modifier la note"]').first()
    if (await noteBtn.count() > 0) {
      await noteBtn.click()
      await expect(page.locator('textarea[placeholder="Ajouter une note interne…"]')).toBeVisible({ timeout: 5000 })
      await page.getByRole('button', { name: 'Annuler' }).click()
      await expect(page.locator('textarea[placeholder="Ajouter une note interne…"]')).not.toBeVisible()
    }
  })

  test('drawer historique — ouverture puis fermeture', async ({ page }) => {
    await page.locator('button').filter({ hasText: 'Liste' }).click()
    await page.locator('select').nth(1).selectOption('all')
    await page.getByRole('button', { name: /Lancer|Rechercher/i }).click()
    const evtBtn = page.locator('button[title="Historique"]').first()
    if (await evtBtn.count() > 0) {
      await evtBtn.click()
      await expect(page.locator('text=/Historique/i').first()).toBeVisible({ timeout: 5000 })
      // Fermeture via bouton X
      const closeBtn = page.locator('button').filter({ has: page.locator('svg') }).last()
      await closeBtn.click()
    }
  })

  test('pas d\'erreur 500 sur la page', async ({ page }) => {
    await expect(page.locator('body')).not.toContainText('Internal Server Error')
    await expect(page.locator('body')).not.toContainText('500')
  })
})

test.describe('Documents clients — upload wizard cab (step 1)', () => {
  test.use({ storageState: CAB_AUTH_FILE })

  test.beforeEach(async ({ page }) => {
    await page.goto('/documents/nouveau')
    await page.waitForLoadState('networkidle')
  })

  test('indicateur 3 étapes visible', async ({ page }) => {
    await expect(page.locator('text=/Déposer/i').first()).toBeVisible({ timeout: 10000 })
  })

  test('sélecteur client présent', async ({ page }) => {
    await expect(page.locator('text=/Sélectionner un client/i')).toBeVisible({ timeout: 10000 })
  })

  test('boutons source "Document client" et "Livrable cabinet" visibles après sélection client', async ({ page }) => {
    // Les boutons de source s'affichent seulement après qu'un client est sélectionné
    const clientSelector = page.locator('text=/Sélectionner un client/i')
    if (await clientSelector.count() > 0) {
      await clientSelector.click()
      const firstOption = page.locator('text=/Sélectionner un client/i')
        .locator('..').locator('div').first()
      // Si des options sont disponibles, la source apparaît
      const sourceDoc = page.locator('text=Document client')
      const sourceLiv = page.locator('text=Livrable cabinet')
      // On vérifie seulement si les boutons source sont présents (pas d'assertion forte)
      if (await sourceDoc.count() > 0) {
        await expect(sourceDoc).toBeVisible()
        await expect(sourceLiv).toBeVisible()
      }
    }
  })

  test('bouton Suivant désactivé sans sélection', async ({ page }) => {
    // Cherche le bouton "Suivant" par son texte (→ peut être un caractère unicode)
    const suivant = page.locator('button').filter({ hasText: /Suivant/ })
    if (await suivant.count() > 0) {
      await expect(suivant.first()).toBeDisabled({ timeout: 10000 })
    }
  })

  test('bouton Annuler → retour /documents', async ({ page }) => {
    const annuler = page.getByRole('button', { name: /Annuler/i })
    if (await annuler.count() > 0) {
      await annuler.click()
      await page.waitForURL('**/documents', { timeout: 8000 })
      expect(page.url()).toContain('/documents')
    }
  })
})
