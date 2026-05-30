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

  test('sidebar portail visible avec les liens de navigation', async ({ page }) => {
    await expect(page.locator('aside')).toBeVisible()
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
    await expect(page.locator('text=À faire').first()).toBeVisible({ timeout: 10000 })
    await expect(page.locator('text=Fait').first()).toBeVisible()
    await expect(page.locator('text=En retard').first()).toBeVisible()
  })

  test('navigation année — avancer puis reculer', async ({ page }) => {
    const year = new Date().getFullYear()
    // Cible les boutons de nav dans le main, pas sidebar/header
    const mainBtns = page.locator('main').getByRole('button').filter({ has: page.locator('svg') })
    await mainBtns.last().click()
    await expect(page.locator(`text=${year + 1}`).first()).toBeVisible({ timeout: 5000 })
    await mainBtns.first().click()
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

  test('nav portail — tous les liens présents', async ({ page }) => {
    const nav = page.locator('nav').or(page.locator('aside'))
    await expect(nav.getByRole('link', { name: 'Mes tâches' })).toBeVisible({ timeout: 8000 })
    await expect(nav.getByRole('link', { name: 'Mes documents' })).toBeVisible()
    await expect(nav.getByRole('link', { name: 'Livrables cabinet' })).toBeVisible()
    await expect(nav.getByRole('link', { name: 'Ma société' })).toBeVisible()
  })

  test('nav portail — navigation vers Mes documents', async ({ page }) => {
    const nav = page.locator('nav').or(page.locator('aside'))
    await nav.getByRole('link', { name: 'Mes documents' }).click()
    await page.waitForURL('**/mes-documents', { timeout: 8000 })
    expect(page.url()).toContain('/mes-documents')
  })

  test('nav portail — navigation vers Ma société', async ({ page }) => {
    const nav = page.locator('nav').or(page.locator('aside'))
    await nav.getByRole('link', { name: 'Ma société' }).click()
    await page.waitForURL('**/ma-societe', { timeout: 8000 })
    expect(page.url()).toContain('/ma-societe')
  })

  test('nav portail — navigation vers Livrables cabinet', async ({ page }) => {
    const nav = page.locator('nav').or(page.locator('aside'))
    await nav.getByRole('link', { name: 'Livrables cabinet' }).click()
    await page.waitForURL('**/mes-livrables', { timeout: 8000 })
    expect(page.url()).toContain('/mes-livrables')
  })

  test('pas d\'erreur serveur', async ({ page }) => {
    await expect(page.locator('body')).not.toContainText('Internal Server Error')
    await expect(page.locator('body')).not.toContainText('500')
  })
})
