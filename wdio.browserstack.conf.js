const baseConfig = require('./wdio.conf.js').config;
const baseAfterTest = baseConfig.afterTest;

exports.config = {
    ...baseConfig,
    
    // 1. Authentication (Prioritizes CI/CD Envs, allows local fallback)
    user: process.env.BROWSERSTACK_USERNAME || '', 
    key: process.env.BROWSERSTACK_ACCESS_KEY || '',

    protocol: 'https',
    hostname: 'hub.browserstack.com',
    port: 443,
    path: '/wd/hub',

    // 2. BrowserStack Services & Observability
    services: [[
        'browserstack',
        {
            testObservability: true,
            testObservabilityOptions: {
                projectName: process.env.BS_PROJECT_NAME || 'Rova Mobile Script',
                buildName: process.env.BS_BUILD_NAME || 'Nightly regression',
                buildTag: process.env.BS_BUILD_TAG || 'manual-run',
            },
            // Captures the URL from the CodeMagic -> GitHub bridge
            app: process.env.BROWSERSTACK_APP_URL || '', 
            browserstackLocal: process.env.BROWSERSTACK_LOCAL === 'true',
        }
    ]],

    // 3. Dynamic Capabilities
    capabilities: [
        {
            platformName: process.env.PLATFORM === 'ios' ? 'iOS' : 'Android',
            'appium:automationName': process.env.PLATFORM === 'ios' ? 'XCUITest' : 'UiAutomator2',
            // Uses Android package or iOS bundle ID depending on platform
            'appium:appPackage': process.env.PLATFORM === 'ios' ? undefined : 'com.roava.app',
            'appium:appActivity': process.env.PLATFORM === 'ios' ? undefined : 'com.roava.app.MainActivity',
            'appium:bundleId': process.env.PLATFORM === 'ios' ? 'com.rova.ios' : undefined,
            'appium:noReset': false,
            'appium:autoGrantPermissions': true,
            'appium:newCommandTimeout': 15000,
            'bstack:options': {
                deviceName: process.env.PLATFORM === 'ios' ? 'iPhone 16 Pro' : 'Google Pixel 9',
                osVersion: process.env.PLATFORM === 'ios' ? '18' : '15.0',
                projectName: 'Rova Mobile Script',
                buildName: process.env.BS_BUILD_NAME,
                sessionName: process.env.BS_SESSION_NAME || 'Full Suite Run',
                debug: true,
                networkLogs: true,
            }
        }
    ],

    // 4. Status Reporting (The Developer's logic to mark Pass/Fail in BS)
    afterTest: async function (test, context, result) {
        if (typeof baseAfterTest === 'function') {
            await baseAfterTest.call(this, test, context, result);
        }

        try {
            const status = result?.passed ? 'passed' : 'failed';
            const reason = result?.error?.message || (result?.passed ? 'Test passed' : 'Test failed');
            await browser.execute(
                `browserstack_executor: ${JSON.stringify({
                    action: 'setSessionStatus',
                    arguments: { status, reason }
                })}`
            );
        } catch (err) {
            console.log('BrowserStack status update failed:', err.message);
        }
    }
};

// Safety Check for CI/CD
if (process.env.GITHUB_ACTIONS && (!exports.config.user || !exports.config.key)) {
    throw new Error('Missing BrowserStack credentials in GitHub Environment.');
}