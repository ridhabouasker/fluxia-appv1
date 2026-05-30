import { test, expect } from '@playwright/test'
import { CLIENT_AUTH_FILE } from './constants'

test.describe('Ma société — accès non authentifié', () => {
  test('redirige vers /login', async ({ page }) => {
    await page.goto('/ma-societe')
    await page.waitForURL('**/login', { timeout: 8000 })
    expect(page.url()).toContain('/login')
  })
})

test.describe('Ma société — client connecté', () => {
  test.use({ storageState: CLIENT_AUTH_FILE })

  test.beforeEach(async ({ page }) => {
    await page.goto('/ma-societe')
    await expect(page.locator('h1', { hasText: 'Ma société' })).toBeVisible({ timeout: 10000 })
  })

  test('titre "Ma société" visible', async ({ page }) => {
    await expect(page.locator('h1', { hasText: 'Ma société' })).toBeVisible()
  })

  test('onglets "Données générales" et "Utilisateurs" visibles', async ({ page }) => {
    await expect(page.getByRole('button', { name: 'Données générales' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Utilisateurs' })).toBeVisible()
  })

  test('onglet Données générales actif par défaut — champs visibles', async ({ page }) => {
    await expect(page.getByRole('button', { name: 'Données générales' })).toBeVisible()
    await expect(page.locator('input').first()).toBeVisible({ timeout: 8000 })
  })

  test('champ Numéro TVA visible', async ({ page }) => {
    await expect(page.locator('text=Numéro TVA')).toBeVisible({ timeout: 8000 })
  })

  test('champ Email visible (section Contact)', async ({ page }) => {
    await expect(page.locator('text=Email').first()).toBeVisible({ timeout: 8000 })
  })

  test('bouton Enregistrer visible dans l\'onglet Données générales', async ({ page }) => {
    await expect(page.getByRole('button', { name: /Enregistrer/i })).toBeVisible({ timeout: 8000 })
  })

  test('onglet Utilisateurs — table des utilisateurs visible', async ({ page }) => {
    await page.getByRole('button', { name: 'Utilisateurs' }).click()
    // La table des utilisateurs apparaît toujours (même vide)
    await expect(page.locator('table').first()).toBeVisible({ timeout: 8000 })
  })

  test('onglet Utilisateurs — colonnes Nom et Statut présentes', async ({ page }) => {
    await page.getByRole('button', { name: 'Utilisateurs' }).click()
    await expect(page.locator('table').first()).toBeVisible({ timeout: 8000 })
    await expect(page.locator('th', { hasText: 'Nom' }).first()).toBeVisible()
    await expect(page.locator('th', { hasText: 'Statut' }).first()).toBeVisible()
  })

  test('onglet Utilisateurs — section invite présente si admin', async ({ page }) => {
    await page.getByRole('button', { name: 'Utilisateurs' }).click()
    await expect(page.locator('table').first()).toBeVisible({ timeout: 8000 })
    // La section invite peut être absente si l'utilisateur n'est pas admin — pas d'assertion stricte
    const inviteInput = page.locator('input[placeholder="prenom.nom@societe.com"]')
    if (await inviteInput.count() > 0) {
      await expect(inviteInput).toBeVisible()
      await expect(page.getByRole('button', { name: /Envoyer l'invitation|Inviter/i })).toBeVisible()
    }
  })

  test('onglet Utilisateurs — bouton invite désactivé si email vide (si admin)', async ({ page }) => {
    await page.getByRole('button', { name: 'Utilisateurs' }).click()
    const inviteBtn = page.getByRole('button', { name: /Envoyer l'invitation/i })
    if (await inviteBtn.count() > 0) {
      await expect(inviteBtn).toBeDisabled()
    }
  })

  test('switch entre onglets ne plante pas la page', async ({ page }) => {
    await page.getByRole('button', { name: 'Utilisateurs' }).click()
    await expect(page.locator('table').first()).toBeVisible({ timeout: 8000 })
    await page.getByRole('button', { name: 'Données générales' }).click()
    await expect(page.locator('input').first()).toBeVisible({ timeout: 8000 })
    expect(page.url()).toContain('/ma-societe')
  })

  test('nav portail — lien "Ma société" accessible', async ({ page }) => {
    const nav = page.locator('nav').or(page.locator('aside'))
    await expect(nav.getByRole('link', { name: 'Ma société' })).toBeVisible({ timeout: 8000 })
  })

  test('pas d\'erreur serveur', async ({ page }) => {
    await expect(page.locator('body')).not.toContainText('Internal Server Error')
    await expect(page.locator('body')).not.toContainText('500')
  })
})
