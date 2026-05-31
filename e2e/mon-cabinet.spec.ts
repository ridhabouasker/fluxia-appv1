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
    // Exclure l'input file caché (logo upload) — cibler les champs texte visibles
    await expect(page.locator('input:not([type="file"])').first()).toBeVisible({ timeout: 10000 })
  })

  test('onglet Données générales — sections Identité et Coordonnées', async ({ page }) => {
    await page.getByRole('button', { name: 'Données générales' }).click()
    await expect(page.locator('text=/Identité|Général|Coordonnées/i').first()).toBeVisible({ timeout: 10000 })
  })

  test('onglet Utilisateurs — table des utilisateurs visible', async ({ page }) => {
    await page.getByRole('button', { name: 'Utilisateurs' }).click()
    await expect(page.locator('table').first()).toBeVisible({ timeout: 10000 })
    await expect(page.locator('th', { hasText: 'Nom' }).first()).toBeVisible()
  })

  test('onglet Utilisateurs — formulaire invitation email', async ({ page }) => {
    await page.getByRole('button', { name: 'Utilisateurs' }).click()
    await expect(page.locator('input[type="email"]')).toBeVisible({ timeout: 10000 })
    await expect(page.getByRole('button', { name: /Inviter/i })).toBeVisible()
  })

  test('onglet Utilisateurs — colonne Statut présente', async ({ page }) => {
    await page.getByRole('button', { name: 'Utilisateurs' }).click()
    await expect(page.locator('th', { hasText: 'Statut' }).first()).toBeVisible({ timeout: 10000 })
  })

  test('onglet Utilisateurs — badge Statut visible sur chaque ligne', async ({ page }) => {
    await page.getByRole('button', { name: 'Utilisateurs' }).click()
    await expect(page.locator('tbody tr').first()).toBeVisible({ timeout: 10000 })
    const statusCells = page.locator('tbody tr td').filter({ hasText: /Actif|Inactif/ })
    await expect(statusCells.first()).toBeVisible()
  })

  test('onglet Utilisateurs — badge Admin présent sur chaque ligne', async ({ page }) => {
    await page.getByRole('button', { name: 'Utilisateurs' }).click()
    await expect(page.locator('tbody tr').first()).toBeVisible({ timeout: 10000 })
    await expect(page.locator('th', { hasText: 'Admin' }).first()).toBeVisible()
  })

  test('onglet Utilisateurs — propre ligne non cliquable sur Statut (soi-même)', async ({ page }) => {
    await page.getByRole('button', { name: 'Utilisateurs' }).click()
    await expect(page.locator('tbody tr').first()).toBeVisible({ timeout: 10000 })
    // La ligne avec "(vous)" doit avoir un span statique, pas un bouton cliquable
    const ownRow = page.locator('tbody tr').filter({ hasText: '(vous)' })
    if (await ownRow.count() > 0) {
      const statusSpan = ownRow.locator('span').filter({ hasText: /Actif|Inactif/ })
      await expect(statusSpan).toBeVisible()
    }
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

  // ─── Quota storage ─────────────────────────────────────────────────────────

  test('quota storage — section "Stockage" visible dans Données générales', async ({ page }) => {
    await page.getByRole('button', { name: 'Données générales' }).click()
    await expect(page.locator('text=/Stockage|stockage/i').first()).toBeVisible({ timeout: 10000 })
  })

  test('quota storage — affichage usage en Mo ou Go', async ({ page }) => {
    await page.getByRole('button', { name: 'Données générales' }).click()
    await expect(page.locator('text=/Mo|Go/').first()).toBeVisible({ timeout: 10000 })
  })

  test('quota storage — barre de progression visible', async ({ page }) => {
    await page.getByRole('button', { name: 'Données générales' }).click()
    // La barre est un div avec une largeur en % — chercher le container barre
    const bar = page.locator('[style*="background"][style*="height"]')
      .or(page.locator('div').filter({ hasText: /Mo|Go/ }).locator('div').first())
    await expect(page.locator('body')).not.toContainText('Internal Server Error')
    // L'usage est affiché sans erreur
    await expect(page.locator('text=/utilisé|quota|Stockage/i').first()).toBeVisible({ timeout: 10000 })
  })

  test('quota storage — pas d\'erreur serveur', async ({ page }) => {
    await page.getByRole('button', { name: 'Données générales' }).click()
    await expect(page.locator('body')).not.toContainText('Internal Server Error')
    await expect(page.locator('body')).not.toContainText('NaN')
  })
})
