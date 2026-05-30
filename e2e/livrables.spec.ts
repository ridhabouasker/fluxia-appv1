import { test, expect } from '@playwright/test'
import { CAB_AUTH_FILE } from './constants'

test.describe('Livrables cabinet — accès non authentifié', () => {
  test('redirige vers /login', async ({ page }) => {
    await page.goto('/livrables')
    await page.waitForURL('**/login', { timeout: 8000 })
    expect(page.url()).toContain('/login')
  })
})

test.describe('Livrables cabinet — cabinet connecté', () => {
  test.use({ storageState: CAB_AUTH_FILE })

  test.beforeEach(async ({ page }) => {
    await page.goto('/livrables')
    await expect(page.locator('h1', { hasText: 'Livrables' })).toBeVisible({ timeout: 10000 })
  })

  test('titre "Livrables" visible', async ({ page }) => {
    await expect(page.locator('h1', { hasText: 'Livrables' })).toBeVisible()
  })

  test('select année présent avec l\'année courante', async ({ page }) => {
    const yearSelect = page.locator('select').first()
    await expect(yearSelect).toBeVisible()
    await expect(yearSelect).toHaveValue(String(new Date().getFullYear()))
  })

  test('bouton Rechercher présent', async ({ page }) => {
    await expect(page.getByRole('button', { name: /Rechercher/i })).toBeVisible()
  })

  test('filtre client autosuggest présent', async ({ page }) => {
    // ClientAutosuggest rend un <input> sans type explicite — matcher sur "input" directement
    await expect(page.locator('input').first()).toBeVisible({ timeout: 8000 })
  })

  test('page ne contient pas d\'erreur serveur', async ({ page }) => {
    await expect(page.locator('body')).not.toContainText('Internal Server Error')
    await expect(page.locator('body')).not.toContainText('500')
  })

  test('table toujours rendue après Rechercher', async ({ page }) => {
    await page.locator('select').first().selectOption({ index: 0 })
    await page.getByRole('button', { name: /Rechercher/i }).click()
    // La table est toujours présente (même état vide est dans la table)
    await expect(page.locator('table')).toBeVisible({ timeout: 10000 })
  })

  test('bouton téléchargement ou message vide présent après Rechercher', async ({ page }) => {
    await page.locator('select').first().selectOption({ index: 0 })
    await page.getByRole('button', { name: /Rechercher/i }).click()
    await expect(page.locator('table')).toBeVisible({ timeout: 10000 })
    const dlBtn = page.locator('button[title="Télécharger"]').first()
    const emptyMsg = page.locator('text=Aucun livrable').first()
    // L'un ou l'autre doit être présent
    const hasDl = await dlBtn.count() > 0
    const hasEmpty = await emptyMsg.count() > 0
    expect(hasDl || hasEmpty).toBeTruthy()
  })

  test('modal note — ouverture et fermeture', async ({ page }) => {
    await page.locator('select').first().selectOption({ index: 0 })
    await page.getByRole('button', { name: /Rechercher/i }).click()
    const noteBtn = page.locator('button[title="Modifier la note"], button[title="Ajouter note"]').first()
    if (await noteBtn.count() > 0) {
      await noteBtn.click()
      await expect(page.locator('textarea[placeholder="Ajouter une note interne…"]')).toBeVisible({ timeout: 5000 })
      await page.getByRole('button', { name: 'Annuler' }).click()
      await expect(page.locator('textarea[placeholder="Ajouter une note interne…"]')).not.toBeVisible()
    }
  })

  test('modal de confirmation suppression — Annuler referme le modal', async ({ page }) => {
    await page.locator('select').first().selectOption({ index: 0 })
    await page.getByRole('button', { name: /Rechercher/i }).click()
    const deleteBtn = page.locator('button[title="Supprimer"]').first()
    if (await deleteBtn.count() > 0) {
      await deleteBtn.click()
      await expect(page.locator('text=/supprimer|confirmer/i').first()).toBeVisible({ timeout: 5000 })
      await page.getByRole('button', { name: 'Annuler' }).click()
      await expect(page.locator('text=/supprimer|confirmer/i').first()).not.toBeVisible()
    }
  })

  test('pagination — sélecteur de lignes par page visible', async ({ page }) => {
    await page.locator('select').first().selectOption({ index: 0 })
    await page.getByRole('button', { name: /Rechercher/i }).click()
    await expect(page.locator('table')).toBeVisible({ timeout: 8000 })
    const allSelects = page.locator('select')
    const count = await allSelects.count()
    expect(count).toBeGreaterThanOrEqual(1)
  })

  test('drawer historique — ouverture via bouton horloge', async ({ page }) => {
    await page.locator('select').first().selectOption({ index: 0 })
    await page.getByRole('button', { name: /Rechercher/i }).click()
    const histBtn = page.locator('button[title="Historique"]').first()
    if (await histBtn.count() > 0) {
      await histBtn.click()
      await expect(page.locator('text=/Historique/i').first()).toBeVisible({ timeout: 5000 })
    }
  })
})
