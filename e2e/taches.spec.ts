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
    await expect(page.locator('text=À faire')).toBeVisible({ timeout: 10000 })
    await expect(page.locator('text=Fait')).toBeVisible()
    await expect(page.locator('text=En retard')).toBeVisible()
  })

  test('navigation année — avancer', async ({ page }) => {
    const year = new Date().getFullYear()
    await page.getByRole('button').filter({ has: page.locator('svg') }).last().click()
    await expect(page.locator(`text=${year + 1}`).first()).toBeVisible({ timeout: 5000 })
  })

  test('navigation année — reculer', async ({ page }) => {
    const year = new Date().getFullYear()
    await page.getByRole('button').filter({ has: page.locator('svg') }).first().click()
    await expect(page.locator(`text=${year - 1}`).first()).toBeVisible({ timeout: 5000 })
  })

  test('clic cellule passée → modal de statut', async ({ page }) => {
    // Cherche une cellule cliquable (passée, non grisée)
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

  test('modal statut — fermeture via overlay', async ({ page }) => {
    const cell = page.locator('td div[style*="cursor: pointer"], td div.cursor-pointer').first()
    if (await cell.count() > 0) {
      await cell.click()
      await expect(page.locator('text=/Fait|À faire/i').first()).toBeVisible({ timeout: 5000 })
      await page.keyboard.press('Escape')
      await expect(page.locator('text=/Fait|À faire/i').first()).not.toBeVisible({ timeout: 3000 })
    }
  })
})
