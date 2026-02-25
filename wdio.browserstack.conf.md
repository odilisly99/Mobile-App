//require('dotenv').config();
// Uncomment line 1 if you want to use an environment file 

const baseConfig = require('./wdio.conf.js').config;

const baseAfterTest = baseConfig.afterTest;

const browserStackConfig = {
    ...baseConfig,
    // Hardcoded per request.
    user: '', //Input browserstack username here
    key: '',  //Input browserstack access key here

    protocol: 'https',
    hostname: 'hub.browserstack.com',
    port: 443,
    path: '/wd/hub',

    services: [[
        'browserstack',
        {
            testObservability: true,
            testObservabilityOptions: {
                projectName: process.env.BS_PROJECT_NAME || 'Rova Mobile Script',
                buildName: process.env.BS_BUILD_NAME || 'Nightly regression',
                buildTag: process.env.BS_BUILD_TAG || 'local-run',
            },
            app: '', //Input appID here 
            browserstackLocal: process.env.BROWSERSTACK_LOCAL === 'true',
        }
    ]],

    capabilities: [
        {
            platformName: 'Android',
            'appium:automationName': 'UiAutomator2',
            'appium:appPackage': 'com.roava.app',
            'appium:appActivity': 'com.roava.app.MainActivity',
            'appium:noReset': false,
            'appium:autoGrantPermissions': true,
            'appium:newCommandTimeout': 15000,
            'bstack:options': {
                deviceName: process.env.BS_DEVICE || 'Google Pixel 9',
                osVersion: process.env.BS_OS_VERSION || '15.0',
                projectName: process.env.BS_PROJECT_NAME || 'Rova Mobile Script',
                buildName: process.env.BS_BUILD_NAME || 'Rova Mobile BrowserStack',
                sessionName: process.env.BS_SESSION_NAME || 'Full Suite',
                debug: true,
                networkLogs: true,
            }
        }
    ],

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

if (!browserStackConfig.user || !browserStackConfig.key) {
    throw new Error('Missing BrowserStack credentials. Set BROWSERSTACK_USERNAME and BROWSERSTACK_ACCESS_KEY.');
}

if (!browserStackConfig.services?.[0]?.[1]?.app) {
    throw new Error('Missing app reference in BrowserStack service config.');
}

exports.config = browserStackConfig;
