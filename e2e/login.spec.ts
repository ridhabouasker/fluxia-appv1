import { test, expect } from '@playwright/test'

const CAB_EMAIL = process.env.TEST_CAB_EMAIL!
const CAB_PASSWORD = process.env.TEST_CAB_PASSWORD!
const CLIENT_EMAIL = process.env.TEST_CLIENT_EMAIL!
const CLIENT_PASSWORD = process.env.TEST_CLIENT_PASSWORD!

test.describe('Login', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login')
  })

  test('affiche le formulaire de connexion', async ({ page }) => {
    await expect(page.getByText('FluxIA')).toBeVisible()
    await expect(page.getByLabel('Email')).toBeVisible()
    await expect(page.getByLabel('Mot de passe')).toBeVisible()
    await expect(page.getByRole('button', { name: 'Se connecter' })).toBeVisible()
  })

  test('cabinet → redirigé vers /dashboard', async ({ page }) => {
    await page.getByLabel('Email').fill(CAB_EMAIL)
    await page.getByLabel('Mot de passe').fill(CAB_PASSWORD)
    await page.getByRole('button', { name: 'Se connecter' }).click()
    await page.waitForURL('**/dashboard', { timeout: 10000 })
    expect(page.url()).toContain('/dashboard')
  })

  test('client → redirigé vers /mes-taches', async ({ page }) => {
    await page.getByLabel('Email').fill(CLIENT_EMAIL)
    await page.getByLabel('Mot de passe').fill(CLIENT_PASSWORD)
    await page.getByRole('button', { name: 'Se connecter' }).click()
    await page.waitForURL('**/mes-taches', { timeout: 10000 })
    expect(page.url()).toContain('/mes-taches')
  })

  test('mauvais mot de passe → message d\'erreur', async ({ page }) => {
    await page.getByLabel('Email').fill(CAB_EMAIL)
    await page.getByLabel('Mot de passe').fill('mauvais-mdp')
    await page.getByRole('button', { name: 'Se connecter' }).click()
    await expect(page.getByText('Email ou mot de passe incorrect.')).toBeVisible()
    expect(page.url()).toContain('/login')
  })

  test('?suspended=1 → bannière "Compte suspendu" visible', async ({ page }) => {
    await page.goto('/login?suspended=1')
    await expect(page.getByText('Compte suspendu')).toBeVisible({ timeout: 5000 })
    await expect(page.getByText(/Contactez votre cabinet/i)).toBeVisible()
  })

  test('?suspended=1 → formulaire de connexion toujours affiché', async ({ page }) => {
    await page.goto('/login?suspended=1')
    await expect(page.getByLabel('Email')).toBeVisible()
    await expect(page.getByRole('button', { name: 'Se connecter' })).toBeVisible()
  })

  test('bannière suspendu disparaît quand on soumet le formulaire', async ({ page }) => {
    await page.goto('/login?suspended=1')
    await expect(page.getByText('Compte suspendu')).toBeVisible()
    await page.getByLabel('Email').fill(CAB_EMAIL)
    await page.getByLabel('Mot de passe').fill('mauvais-mdp')
    await page.getByRole('button', { name: 'Se connecter' }).click()
    // La bannière suspendu laisse place au message d'erreur classique
    await expect(page.getByText('Email ou mot de passe incorrect.')).toBeVisible()
  })
})
