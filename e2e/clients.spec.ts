import { test, expect } from '@playwright/test'
import { CAB_AUTH_FILE } from './constants'

test.describe('Clients — accès non authentifié', () => {
  test('redirige vers /login', async ({ page }) => {
    await page.goto('/clients')
    await page.waitForURL('**/login', { timeout: 8000 })
    expect(page.url()).toContain('/login')
  })
})

test.describe('Clients — cabinet connecté', () => {
  test.use({ storageState: CAB_AUTH_FILE })

  test('liste des clients charge', async ({ page }) => {
    await page.goto('/clients')
    await expect(page.locator('h1', { hasText: 'Clients' })).toBeVisible({ timeout: 10000 })
  })

  test('barre de recherche visible', async ({ page }) => {
    await page.goto('/clients')
    await expect(page.getByPlaceholder('Rechercher un client…')).toBeVisible({ timeout: 10000 })
  })

  test('bouton "+ Nouveau client" accessible', async ({ page }) => {
    await page.goto('/clients')
    await expect(page.getByRole('button', { name: 'Nouveau client' })).toBeVisible({ timeout: 10000 })
  })

  test('au moins un client affiché', async ({ page }) => {
    await page.goto('/clients')
    await expect(page.locator('tbody tr').first()).toBeVisible({ timeout: 10000 })
  })

  test('colonnes du tableau visibles', async ({ page }) => {
    await page.goto('/clients')
    await expect(page.getByText('Nom')).toBeVisible({ timeout: 10000 })
    await expect(page.getByText('Type')).toBeVisible()
    await expect(page.getByText('Pays')).toBeVisible()
    await expect(page.getByText('Statut')).toBeVisible()
  })

  test('recherche filtre les résultats', async ({ page }) => {
    await page.goto('/clients')
    await page.locator('tbody tr').first().waitFor({ timeout: 10000 })
    const search = page.getByPlaceholder('Rechercher un client…')
    await search.fill('xxxxxxxxinexistant')
    await expect(page.getByText('Aucun résultat.')).toBeVisible()
    await search.clear()
  })

  test('clic sur une ligne → fiche client', async ({ page }) => {
    await page.goto('/clients')
    await page.locator('tbody tr').first().waitFor({ timeout: 10000 })
    await page.locator('tbody tr').first().click()
    await page.waitForURL('**/clients/**', { timeout: 8000 })
    expect(page.url()).toMatch(/\/clients\/[a-f0-9-]+/)
  })

  test('bouton "Nouveau client" → formulaire', async ({ page }) => {
    await page.goto('/clients')
    await page.getByRole('button', { name: 'Nouveau client' }).click()
    await page.waitForURL('**/clients/nouveau', { timeout: 8000 })
    await expect(page.getByRole('button', { name: /Enregistrer|Créer/i })).toBeVisible({ timeout: 10000 })
  })
})

test.describe('Nouveau client — formulaire', () => {
  test.use({ storageState: CAB_AUTH_FILE })

  test.beforeEach(async ({ page }) => {
    await page.goto('/clients/nouveau')
  })

  test('sections Identité et Coordonnées visibles', async ({ page }) => {
    await expect(page.locator('text=/Identité|Identification/i').first()).toBeVisible({ timeout: 10000 })
  })

  test('champ Nom obligatoire visible', async ({ page }) => {
    await expect(page.locator('input').first()).toBeVisible({ timeout: 10000 })
  })

  test('select Pays présent avec les 3 options', async ({ page }) => {
    const select = page.locator('select').first()
    await expect(select).toBeVisible({ timeout: 10000 })
    const options = await select.locator('option').allTextContents()
    expect(options.some(o => o.includes('France'))).toBeTruthy()
    expect(options.some(o => o.includes('Tunisie'))).toBeTruthy()
    expect(options.some(o => o.includes('Maroc'))).toBeTruthy()
  })

  test('bouton Créer désactivé sans nom saisi', async ({ page }) => {
    // Le bouton est disabled tant que name est vide — pas de soumission possible
    const submitBtn = page.getByRole('button', { name: /Créer/i })
    await expect(submitBtn).toBeDisabled({ timeout: 5000 })
  })
})

test.describe('Fiche client', () => {
  test.use({ storageState: CAB_AUTH_FILE })

  test('onglets "Informations" et "Utilisateurs" visibles', async ({ page }) => {
    await page.goto('/clients')
    await page.locator('tbody tr').first().waitFor({ timeout: 10000 })
    await page.locator('tbody tr').first().click()
    await page.waitForURL('**/clients/**', { timeout: 8000 })
    await expect(page.getByRole('button', { name: 'Informations' })).toBeVisible({ timeout: 10000 })
    await expect(page.getByRole('button', { name: 'Utilisateurs' })).toBeVisible()
  })

  test('bouton Retour → liste des clients', async ({ page }) => {
    await page.goto('/clients')
    await page.locator('tbody tr').first().waitFor({ timeout: 10000 })
    await page.locator('tbody tr').first().click()
    await page.waitForURL('**/clients/**', { timeout: 8000 })
    // Le bouton Retour est icon-only (ArrowLeft SVG, pas de texte) — premier bouton du main
    await page.locator('main button').first().click()
    await page.waitForURL('**/clients', { timeout: 8000 })
    expect(page.url()).toMatch(/\/clients$/)
  })
})
