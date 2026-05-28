import { test as setup, expect } from '@playwright/test'
import { CAB_AUTH_FILE, CLIENT_AUTH_FILE } from './constants'

setup('authenticate cab', async ({ page }) => {
  await page.goto('/login')
  await page.getByLabel('Email').fill(process.env.TEST_CAB_EMAIL!)
  await page.getByLabel('Mot de passe').fill(process.env.TEST_CAB_PASSWORD!)
  await page.getByRole('button', { name: 'Se connecter' }).click()
  await page.waitForURL('**/dashboard', { timeout: 10000 })
  await page.context().storageState({ path: CAB_AUTH_FILE })
})

setup('authenticate client', async ({ page }) => {
  await page.goto('/login')
  await page.getByLabel('Email').fill(process.env.TEST_CLIENT_EMAIL!)
  await page.getByLabel('Mot de passe').fill(process.env.TEST_CLIENT_PASSWORD!)
  await page.getByRole('button', { name: 'Se connecter' }).click()
  await page.waitForURL('**/mes-taches', { timeout: 10000 })
  await page.context().storageState({ path: CLIENT_AUTH_FILE })
})
