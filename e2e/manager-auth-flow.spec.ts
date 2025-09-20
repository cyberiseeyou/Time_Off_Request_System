import { test, expect } from '@playwright/test';

test.describe('Manager Authentication Flow', () => {
  test('should complete full authentication flow: login -> dashboard -> logout', async ({ page }) => {
    // Step 1: Navigate to manager login page
    await page.goto('/manager/login');

    // Verify login page loads correctly
    await expect(page).toHaveTitle(/Time-Off Request System/);
    await expect(page.getByRole('heading', { name: /manager login/i })).toBeVisible();

    // Step 2: Test login form validation
    const emailInput = page.getByLabel(/email/i);
    const passwordInput = page.getByLabel(/password/i);
    const loginButton = page.getByRole('button', { name: /sign in/i });

    // Test empty form validation
    await loginButton.click();
    await expect(page.getByText(/email is required/i)).toBeVisible();
    await expect(page.getByText(/password is required/i)).toBeVisible();

    // Test invalid email format
    await emailInput.fill('invalid-email');
    await passwordInput.fill('password123');
    await loginButton.click();
    await expect(page.getByText(/invalid email format/i)).toBeVisible();

    // Step 3: Test invalid credentials
    await emailInput.fill('wrong@example.com');
    await passwordInput.fill('wrongpassword');
    await loginButton.click();
    await expect(page.getByText(/invalid email or password/i)).toBeVisible();

    // Step 4: Successful login with valid credentials
    await emailInput.fill('john.smith@productconnections.com');
    await passwordInput.fill('password123');
    await loginButton.click();

    // Verify redirect to dashboard
    await expect(page).toHaveURL('/manager/dashboard');
    await expect(page.getByRole('heading', { name: /manager dashboard/i })).toBeVisible();

    // Step 5: Verify dashboard functionality
    // Check that manager info is displayed
    await expect(page.getByText(/john smith/i)).toBeVisible();
    await expect(page.getByText(/john.smith@productconnections.com/i)).toBeVisible();

    // Check that requests table is visible
    await expect(page.getByRole('table')).toBeVisible();
    await expect(page.getByText(/employee name/i)).toBeVisible();
    await expect(page.getByText(/dates/i)).toBeVisible();
    await expect(page.getByText(/reason/i)).toBeVisible();

    // Verify requests data is loaded (should show at least table headers)
    const tableRows = page.getByRole('row');
    await expect(tableRows).toHaveCount.greaterThan(0);

    // Step 6: Test session persistence
    // Refresh the page to ensure session is maintained
    await page.reload();
    await expect(page).toHaveURL('/manager/dashboard');
    await expect(page.getByRole('heading', { name: /manager dashboard/i })).toBeVisible();

    // Step 7: Test logout functionality
    const logoutButton = page.getByRole('button', { name: /logout/i });
    await expect(logoutButton).toBeVisible();
    await logoutButton.click();

    // Verify redirect to login page after logout
    await expect(page).toHaveURL('/manager/login');
    await expect(page.getByRole('heading', { name: /manager login/i })).toBeVisible();

    // Step 8: Verify session is cleared
    // Try to access dashboard directly after logout
    await page.goto('/manager/dashboard');
    // Should be redirected back to login
    await expect(page).toHaveURL('/manager/login');
  });

  test('should handle direct dashboard access without authentication', async ({ page }) => {
    // Try to access dashboard without logging in
    await page.goto('/manager/dashboard');

    // Should be redirected to login page
    await expect(page).toHaveURL('/manager/login');
    await expect(page.getByRole('heading', { name: /manager login/i })).toBeVisible();
  });

  test('should handle session expiration gracefully', async ({ page }) => {
    // Login first
    await page.goto('/manager/login');
    await page.getByLabel(/email/i).fill('john.smith@productconnections.com');
    await page.getByLabel(/password/i).fill('password123');
    await page.getByRole('button', { name: /sign in/i }).click();

    // Verify we're on dashboard
    await expect(page).toHaveURL('/manager/dashboard');

    // Clear all cookies to simulate session expiration
    await page.context().clearCookies();

    // Try to refresh the page
    await page.reload();

    // Should be redirected to login due to expired session
    await expect(page).toHaveURL('/manager/login');
  });

  test('should display proper error messages for API failures', async ({ page }) => {
    // Mock API failure for login endpoint
    await page.route('**/api/manager/login', route => {
      route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({
          success: false,
          error: 'Internal server error'
        })
      });
    });

    await page.goto('/manager/login');
    await page.getByLabel(/email/i).fill('john.smith@productconnections.com');
    await page.getByLabel(/password/i).fill('password123');
    await page.getByRole('button', { name: /sign in/i }).click();

    // Should display error message
    await expect(page.getByText(/internal server error/i)).toBeVisible();
  });

  test('should be responsive on mobile viewports', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    await page.goto('/manager/login');

    // Verify mobile responsive classes are applied
    const form = page.locator('form').first();
    await expect(form).toBeVisible();

    // Check that the layout adapts to mobile
    const loginCard = page.locator('[data-slot="card"]').first();
    await expect(loginCard).toBeVisible();

    // Verify inputs are properly sized for mobile
    const emailInput = page.getByLabel(/email/i);
    const passwordInput = page.getByLabel(/password/i);

    await expect(emailInput).toBeVisible();
    await expect(passwordInput).toBeVisible();

    // Test mobile interaction
    await emailInput.fill('john.smith@productconnections.com');
    await passwordInput.fill('password123');
    await page.getByRole('button', { name: /sign in/i }).click();

    // Should work on mobile
    await expect(page).toHaveURL('/manager/dashboard');
  });
});