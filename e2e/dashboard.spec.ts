import { test, expect } from '@playwright/test'
import { CAB_AUTH_FILE } from './constants'

test.describe('Dashboard — accès non authentifié', () => {
  test('redirige vers /login', async ({ page }) => {
    await page.goto('/dashboard')
    await page.waitForURL('**/login', { timeout: 8000 })
    expect(page.url()).toContain('/login')
  })
})

test.describe('Dashboard — cabinet connecté', () => {
  test.use({ storageState: CAB_AUTH_FILE })

  test.beforeEach(async ({ page }) => {
    await page.goto('/dashboard')
    // attend que la sidebar soit chargée (fin du spinner)
    await expect(page.getByText('Dashboard')).toBeVisible({ timeout: 10000 })
  })

  test('affiche la sidebar avec les sections de navigation', async ({ page }) => {
    await expect(page.getByText('GESTION')).toBeVisible()
    await expect(page.getByText('DOCUMENTS')).toBeVisible()
    await expect(page.getByText('ADMINISTRATION')).toBeVisible()
  })

  test('sidebar contient tous les liens', async ({ page }) => {
    const sidebar = page.locator('aside')
    await expect(sidebar.getByRole('link', { name: 'Dashboard' })).toBeVisible()
    await expect(sidebar.getByRole('link', { name: 'Tâches récurrentes' })).toBeVisible()
    await expect(sidebar.getByRole('link', { name: 'Documents clients' })).toBeVisible()
    await expect(sidebar.getByRole('link', { name: 'Livrables cabinet' })).toBeVisible()
    await expect(sidebar.getByRole('link', { name: 'Clients' })).toBeVisible()
    await expect(sidebar.getByRole('link', { name: 'Mon cabinet' })).toBeVisible()
  })

  test('Dashboard est le lien actif sur /dashboard', async ({ page }) => {
    const activeLink = page.locator('aside a.text-\\[\\#1D4ED8\\]')
    await expect(activeLink).toContainText('Dashboard')
  })

  test('déconnexion → redirige vers /login', async ({ page }) => {
    await page.locator('button[title="Se déconnecter"]').click()
    await page.waitForURL('**/login', { timeout: 8000 })
    expect(page.url()).toContain('/login')
  })

  test('après déconnexion, /dashboard redirige vers /login', async ({ page }) => {
    await page.locator('button[title="Se déconnecter"]').click()
    await page.waitForURL('**/login', { timeout: 8000 })
    await page.goto('/dashboard')
    await page.waitForURL('**/login', { timeout: 8000 })
    expect(page.url()).toContain('/login')
  })
})
