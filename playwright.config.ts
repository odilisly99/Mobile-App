import { defineConfig } from '@playwright/test';
import * as dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

/**
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './tests_platform/admin',
  /* Global test timeout of 1 minute */
  timeout: 60 * 900000,
  /* Run tests in files in parallel */
  fullyParallel: false,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,

  /* Retry failed tests once - if it passes on second attempt, mark as passed */
  retries: 0,
  /* Opt out of parallel tests on CI. */
  workers: 1,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [
    ['html', { open: 'never' }], // Generate HTML report but never open it
    ['list'], // Show list output in console for CI logs
    ['junit', { outputFile: 'test-results/junit.xml' }], // Generate JUnit XML for CI
    ['json', { outputFile: 'test-results/results.json' }] // Generate JSON for stats parsing
  ] ,
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    actionTimeout: 60000,
    navigationTimeout: 60000,
    trace: 'on',
    launchOptions: {
      headless: process.env.BROWSER_HEADLESS === 'true',
      args: [
        "--isolated", 
        "--no-sandbox", 
        "--disable-dev-shm-usage",
        "--disable-gpu",
        "--disable-web-security",
        "--disable-extensions"
      ],
    },
  },
  /* Configure global timeout for expect assertions */
  expect: {
    timeout: 30000, // 30 seconds for expect assertions
  },

});