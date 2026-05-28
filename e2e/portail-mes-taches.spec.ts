import { test, expect } from '@playwright/test'
import { CLIENT_AUTH_FILE } from './constants'

test.describe('Portail client — accès non authentifié', () => {
  test('/mes-taches redirige vers /login', async ({ page }) => {
    await page.goto('/mes-taches')
    await page.waitForURL('**/login', { timeout: 8000 })
    expect(page.url()).toContain('/login')
  })
})

test.describe('Portail client — mes tâches', () => {
  test.use({ storageState: CLIENT_AUTH_FILE })

  test.beforeEach(async ({ page }) => {
    await page.goto('/mes-taches')
    await expect(page.locator('h1', { hasText: 'Mes tâches' })).toBeVisible({ timeout: 10000 })
  })

  test('header portail visible ("Portail client")', async ({ page }) => {
    await expect(page.locator('text=Portail client')).toBeVisible()
  })

  test('bouton déconnexion présent', async ({ page }) => {
    await expect(page.locator('button[title="Se déconnecter"]')).toBeVisible()
  })

  test('titre "Mes tâches" et sous-titre visibles', async ({ page }) => {
    await expect(page.locator('h1', { hasText: 'Mes tâches' })).toBeVisible()
    await expect(page.locator('text=/Suivi des obligations/i')).toBeVisible()
  })

  test('grille 12 mois visible', async ({ page }) => {
    await expect(page.locator('text=Jan').first()).toBeVisible({ timeout: 10000 })
    await expect(page.locator('text=Déc').first()).toBeVisible()
  })

  test('navigation année — affiche l\'année courante', async ({ page }) => {
    const year = String(new Date().getFullYear())
    await expect(page.locator(`text=${year}`).first()).toBeVisible({ timeout: 10000 })
  })

  test('légende des statuts visible', async ({ page }) => {
    await expect(page.locator('text=À faire')).toBeVisible({ timeout: 10000 })
    await expect(page.locator('text=Fait')).toBeVisible()
    await expect(page.locator('text=En retard')).toBeVisible()
  })

  test('navigation année — avancer puis reculer', async ({ page }) => {
    const year = new Date().getFullYear()
    const btns = page.getByRole('button').filter({ has: page.locator('svg') })
    await btns.last().click()
    await expect(page.locator(`text=${year + 1}`).first()).toBeVisible({ timeout: 5000 })
    await btns.first().click()
    await expect(page.locator(`text=${year}`).first()).toBeVisible()
  })

  test('déconnexion → redirige vers /login', async ({ page }) => {
    await page.locator('button[title="Se déconnecter"]').click()
    await page.waitForURL('**/login', { timeout: 8000 })
    expect(page.url()).toContain('/login')
  })

  test('après déconnexion, /mes-taches redirige vers /login', async ({ page }) => {
    await page.locator('button[title="Se déconnecter"]').click()
    await page.waitForURL('**/login', { timeout: 8000 })
    await page.goto('/mes-taches')
    await page.waitForURL('**/login', { timeout: 8000 })
    expect(page.url()).toContain('/login')
  })
})
