import { expect, test } from '@playwright/test'

const APP_URL = process.env.APP_URL ?? 'http://127.0.0.1:5174/'

test.beforeEach(async ({ page }) => {
  await page.goto(APP_URL)
  await page.evaluate(() => localStorage.clear())
  await page.reload()
  await expect(page.getByRole('button', { name: 'Save article' }).first()).toBeVisible()
})

test('saving a story makes it appear in Saved boards', async ({ page }) => {
  await page.getByRole('button', { name: 'Save article' }).first().click()
  await expect(page.getByRole('dialog', { name: 'Save to board' })).toBeVisible()
  await page.getByRole('button', { name: /Read Later/ }).click()

  await page.getByRole('button', { name: 'Saved', exact: true }).click()

  await expect(page.getByRole('heading', { name: 'Saved' })).toBeVisible()
  await expect(page.getByText('1 article')).toBeVisible()
  await expect(page.getByText('All Saved')).toBeVisible()
  await expect(page.getByText('Read Later')).toBeVisible()
})

test('setting a story reminder creates a reminder item', async ({ page }) => {
  await page.getByRole('button', { name: 'Set reminder' }).first().click()
  await expect(page.getByRole('heading', { name: 'Reminders' })).toBeVisible()

  await page.getByRole('button', { name: 'Add reminder' }).click()

  await expect(page.getByRole('list', { name: /Reminders for/ })).toBeVisible()
  await expect(page.getByRole('button', { name: /Remove reminder at/ })).toBeVisible()
})

test('reacting to a story promotes it into Community', async ({ page }) => {
  const firstStoryTitle = await page.locator('.news-card__title-btn').first().innerText()
  await page.locator('.news-card__fire-btn').first().click()

  await page.getByRole('button', { name: 'Community' }).click()

  await expect(page.getByText(firstStoryTitle)).toBeVisible()
})
