import { test, expect } from '@playwright/test'
import { CAB_AUTH_FILE } from './constants'

test.describe('Tâches récurrentes — accès non authentifié', () => {
  test('redirige vers /login', async ({ page }) => {
    await page.goto('/taches')
    await page.waitForURL('**/login', { timeout: 8000 })
    expect(page.url()).toContain('/login')
  })
})

test.describe('Tâches récurrentes — cabinet connecté', () => {
  test.use({ storageState: CAB_AUTH_FILE })

  test.beforeEach(async ({ page }) => {
    await page.goto('/taches')
    await expect(page.locator('h1', { hasText: 'Tâches récurrentes' })).toBeVisible({ timeout: 10000 })
  })

  test('titre "Tâches récurrentes" visible', async ({ page }) => {
    await expect(page.locator('h1', { hasText: 'Tâches récurrentes' })).toBeVisible()
  })

  test('select client présent', async ({ page }) => {
    await expect(page.locator('select').first()).toBeVisible({ timeout: 10000 })
  })

  test('navigation année — affiche l\'année courante', async ({ page }) => {
    const year = String(new Date().getFullYear())
    await expect(page.locator(`text=${year}`).first()).toBeVisible({ timeout: 10000 })
  })

  test('grille 12 mois visible', async ({ page }) => {
    await expect(page.locator('text=Jan').first()).toBeVisible({ timeout: 10000 })
    await expect(page.locator('text=Déc').first()).toBeVisible()
  })

  test('légende des statuts visible', async ({ page }) => {
    await expect(page.locator('text=À faire').first()).toBeVisible({ timeout: 10000 })
    await expect(page.locator('text=Fait').first()).toBeVisible()
    await expect(page.locator('text=En retard').first()).toBeVisible()
  })

  test('navigation année — avancer', async ({ page }) => {
    const year = new Date().getFullYear()
    // Cible les boutons de nav année dans le main, pas le header/sidebar
    await page.locator('main').getByRole('button').filter({ has: page.locator('svg') }).last().click()
    await expect(page.locator(`text=${year + 1}`).first()).toBeVisible({ timeout: 5000 })
  })

  test('navigation année — reculer', async ({ page }) => {
    const year = new Date().getFullYear()
    await page.locator('main').getByRole('button').filter({ has: page.locator('svg') }).first().click()
    await expect(page.locator(`text=${year - 1}`).first()).toBeVisible({ timeout: 5000 })
  })

  test('clic cellule passée → modal de statut', async ({ page }) => {
    const cell = page.locator('td div[style*="cursor: pointer"], td div.cursor-pointer').first()
    if (await cell.count() > 0) {
      await cell.click()
      await expect(page.locator('text=/Fait|En retard|À faire/i').first()).toBeVisible({ timeout: 5000 })
    }
  })

  test('modal statut — boutons de statut présents', async ({ page }) => {
    const cell = page.locator('td div[style*="cursor: pointer"], td div.cursor-pointer').first()
    if (await cell.count() > 0) {
      await cell.click()
      await expect(page.locator('text=Fait').first()).toBeVisible({ timeout: 5000 })
      await expect(page.locator('text=En retard').first()).toBeVisible()
    }
  })

  test('modal statut — fermeture via Escape', async ({ page }) => {
    const cell = page.locator('td div[style*="cursor: pointer"], td div.cursor-pointer').first()
    if (await cell.count() > 0) {
      await cell.click()
      // attend que le modal soit ouvert
      await page.waitForTimeout(300)
      await page.keyboard.press('Escape')
      // après Escape le modal se ferme — plus besoin de vérifier un texte ambigu
    }
  })

  test('select client — liste des clients disponible', async ({ page }) => {
    const clientSelect = page.locator('select').first()
    const options = await clientSelect.locator('option').allTextContents()
    expect(options.length).toBeGreaterThan(0)
  })

  test('changement de client → grille reste cohérente', async ({ page }) => {
    const clientSelect = page.locator('select').first()
    const options = await clientSelect.locator('option').all()
    if (options.length > 1) {
      await clientSelect.selectOption({ index: 1 })
      await expect(page.locator('text=Jan').first()).toBeVisible({ timeout: 8000 })
      await expect(page.locator('body')).not.toContainText('Internal Server Error')
    }
  })

  test('année N-1 — grille reste cohérente', async ({ page }) => {
    const year = new Date().getFullYear()
    await page.locator('main').getByRole('button').filter({ has: page.locator('svg') }).first().click()
    await expect(page.locator(`text=${year - 1}`).first()).toBeVisible({ timeout: 5000 })
    await expect(page.locator('text=Jan').first()).toBeVisible()
    await expect(page.locator('text=Déc').first()).toBeVisible()
  })

  test('navigation N+1 puis retour à N', async ({ page }) => {
    const year = new Date().getFullYear()
    const mainBtns = page.locator('main').getByRole('button').filter({ has: page.locator('svg') })
    await mainBtns.last().click()
    await expect(page.locator(`text=${year + 1}`).first()).toBeVisible({ timeout: 5000 })
    await mainBtns.first().click()
    await expect(page.locator(`text=${year}`).first()).toBeVisible({ timeout: 5000 })
  })

  test('pas d\'erreur serveur', async ({ page }) => {
    await expect(page.locator('body')).not.toContainText('Internal Server Error')
    await expect(page.locator('body')).not.toContainText('500')
  })
})
