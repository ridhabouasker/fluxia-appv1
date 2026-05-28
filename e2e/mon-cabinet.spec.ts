import { test, expect } from '@playwright/test'
import { CAB_AUTH_FILE } from './constants'

test.describe('Mon cabinet — accès non authentifié', () => {
  test('redirige vers /login', async ({ page }) => {
    await page.goto('/mon-cabinet')
    await page.waitForURL('**/login', { timeout: 8000 })
    expect(page.url()).toContain('/login')
  })
})

test.describe('Mon cabinet — cabinet connecté', () => {
  test.use({ storageState: CAB_AUTH_FILE })

  test.beforeEach(async ({ page }) => {
    await page.goto('/mon-cabinet')
    await expect(page.getByRole('button', { name: 'Données générales' })).toBeVisible({ timeout: 10000 })
  })

  test('onglets "Données générales" et "Utilisateurs" visibles', async ({ page }) => {
    await expect(page.getByRole('button', { name: 'Données générales' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Utilisateurs' })).toBeVisible()
  })

  test('onglet Données générales — champs du cabinet visibles', async ({ page }) => {
    await page.getByRole('button', { name: 'Données générales' }).click()
    await expect(page.locator('input').first()).toBeVisible({ timeout: 10000 })
  })

  test('onglet Données générales — sections Identité et Coordonnées', async ({ page }) => {
    await page.getByRole('button', { name: 'Données générales' }).click()
    await expect(page.locator('text=/Identité|Général|Coordonnées/i').first()).toBeVisible({ timeout: 10000 })
  })

  test('onglet Utilisateurs — liste des utilisateurs actifs', async ({ page }) => {
    await page.getByRole('button', { name: 'Utilisateurs' }).click()
    await expect(page.locator('text=/Utilisateurs actifs/i')).toBeVisible({ timeout: 10000 })
  })

  test('onglet Utilisateurs — formulaire invitation email', async ({ page }) => {
    await page.getByRole('button', { name: 'Utilisateurs' }).click()
    await expect(page.locator('input[type="email"]')).toBeVisible({ timeout: 10000 })
    await expect(page.getByRole('button', { name: /Inviter/i })).toBeVisible()
  })

  test('onglet Utilisateurs — email invalide → erreur', async ({ page }) => {
    await page.getByRole('button', { name: 'Utilisateurs' }).click()
    await page.locator('input[type="email"]').fill('pas-un-email')
    await page.getByRole('button', { name: /Inviter/i }).click()
    await expect(page.locator('text=/invalide|Erreur/i').or(
      page.locator('input[type="email"]:invalid')
    )).toBeVisible()
  })

  test('invitations en attente visibles si présentes', async ({ page }) => {
    await page.getByRole('button', { name: 'Utilisateurs' }).click()
    // Soit des invitations en attente, soit le tableau vide — pas d'erreur serveur
    await expect(page.locator('body')).not.toContainText('Internal Server Error')
  })
})
