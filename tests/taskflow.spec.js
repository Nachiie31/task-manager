const { test, expect } = require('@playwright/test');

const BASE_URL = 'https://task-manager-omega-dun-q6erwfmg3x.vercel.app';

// Test 1 — Landing page loads correctly
test('landing page has correct title', async ({ page }) => {
  await page.goto(BASE_URL);
  await expect(page).toHaveTitle('TaskFlow — Simple Task Management');
});

// Test 2 — Landing page has navbar
test('landing page shows navbar with TaskFlow brand', async ({ page }) => {
  await page.goto(BASE_URL);
  await expect(page.locator('.nav-brand')).toBeVisible();
  await expect(page.locator('.nav-brand')).toContainText('TaskFlow');
});

// Test 3 — Landing page has hero section
test('landing page shows hero section', async ({ page }) => {
  await page.goto(BASE_URL);
  await expect(page.locator('.hero-title')).toBeVisible();
  await expect(page.locator('.hero .btn-hero-primary').first()).toBeVisible();
});

// Test 4 — Get started button goes to signup
test('get started button redirects to signup page', async ({ page }) => {
  await page.goto(BASE_URL);
  await page.click('.btn-hero-primary');
  await expect(page).toHaveURL(`${BASE_URL}/signup.html`);
});

// Test 5 — Login link goes to login page
test('login link redirects to login page', async ({ page }) => {
  await page.goto(BASE_URL);
  await page.click('.btn-nav-login');
  await expect(page).toHaveURL(`${BASE_URL}/login.html`);
});

// Test 6 — Signup page loads
test('signup page loads correctly', async ({ page }) => {
  await page.goto(`${BASE_URL}/signup.html`);
  await expect(page.locator('#email')).toBeVisible();
  await expect(page.locator('#password')).toBeVisible();
  await expect(page.locator('button')).toContainText('Create account');
});

// Test 7 — Signup empty email validation
test('signup shows error for empty email', async ({ page }) => {
  await page.goto(`${BASE_URL}/signup.html`);
  await page.fill('#password', 'test123');
  await page.click('button');
  await expect(page.locator('.error-msg')).toBeVisible();
  await expect(page.locator('.error-msg')).toContainText('Email is required');
});

// Test 8 — Signup short password validation
test('signup shows error for short password', async ({ page }) => {
  await page.goto(`${BASE_URL}/signup.html`);
  await page.fill('#email', 'test@test.com');
  await page.fill('#password', '123');
  await page.click('button');
  await expect(page.locator('.error-msg')).toBeVisible();
  await expect(page.locator('.error-msg')).toContainText('at least 6 characters');
});

// Test 9 — Login page loads
test('login page loads correctly', async ({ page }) => {
  await page.goto(`${BASE_URL}/login.html`);
  await expect(page.locator('#email')).toBeVisible();
  await expect(page.locator('#password')).toBeVisible();
  await expect(page.locator('button')).toContainText('Sign in');
});

// Test 10 — Login empty fields validation
test('login shows error for empty fields', async ({ page }) => {
  await page.goto(`${BASE_URL}/login.html`);
  await page.click('button');
  await expect(page.locator('.error-msg')).toBeVisible();
  await expect(page.locator('.error-msg')).toContainText('All fields are required');
});

// Test 11 — Login wrong password
test('login shows error for wrong password', async ({ page }) => {
  await page.goto(`${BASE_URL}/login.html`);
  await page.fill('#email', 'test@test.com');
  await page.fill('#password', 'wrongpassword');
  await page.click('button');
  await expect(page.locator('.error-msg')).toBeVisible();
  await expect(page.locator('.error-msg')).toContainText('Invalid login credentials');
});

// Test 12 — Pricing page loads
test('pricing page loads correctly', async ({ page }) => {
  await page.goto(`${BASE_URL}/pricing.html`);
  await expect(page.locator('.plan-name').first()).toContainText('Free');
  await expect(page.locator('.plan-name').last()).toContainText('Pro');
});

// Test 13 — Dashboard redirects to login if not logged in
test('dashboard redirects to login when not logged in', async ({ page }) => {
  await page.goto(`${BASE_URL}/dashboard.html`);
  await expect(page).toHaveURL(`${BASE_URL}/login.html`);
});