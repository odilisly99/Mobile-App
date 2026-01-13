// const glob = require('glob'); // <-- ADD THIS LINE

exports.config = {
    runner: 'local',
    port: 4723,
    specs: [
        "./tests/**/*.js"  // Run all tests files
    ],
    suites: {
        authentication: [
            './tests/authentication/signup.js',
            './tests/authentication/login_test.js'
        ],
        beneficiary: [
            './tests/beneficiary/add_delete_beneficiary.js'
        ],
        account: [
            './tests/account/change_passcode.js',
            'tests/account/reset_passcode.js',
            './tests/account/change_transaction_pin.js',
            './tests/account/reset_transaction_pin.js',
            './tests/account/update_phone_email.js'
        ],
        full_flow: [
            './tests/authentication/signup.js',
            './tests/account/change_passcode.js',
            './tests/account/reset_passcode.js',
            './tests/account/change_transaction_pin.js',
            './tests/account/reset_transaction_pin.js',
            './tests/account/update_phone_email.js',
            './tests/beneficiary/add_delete_beneficiary.js'
        ]
    },
    exclude: [
    ],
    // Maximum parallel instances (adjust based on GitHub runner capacity)
    maxInstances: 1,

    capabilities: [
        {
            "platformName": "Android",
            "appium:automationName": "UiAutomator2",
            "appium:deviceName": "Android Emulator",
            "appium:appPackage": "com.roava.app",
            "appium:appActivity": "com.roava.app.MainActivity",
            "appium:noReset": true,
            "maxInstances": 1,
            "appium:newCommandTimeout": 15000

        }
],
    logLevel: 'info',
    bail: 0,
    waitforTimeout: 10000,
    connectionRetryTimeout: 800000,
    connectionRetryCount: 3,
    services: ['appium'],
    framework: 'mocha',
    
    // Retry configuration for failed tests
    specFileRetries: 2,
    specFileRetriesDelay: 0,
    specFileRetriesDeferred: false,
    
    reporters: [
        'spec',
        ['allure', {
            outputDir: 'allure-results-android',
            disableWebdriverStepsReporting: true,
            disableWebdriverScreenshotsReporting: false,
            reportedEnvironmentVars: {
                PLATFORM: 'Android',
                ENVIRONMENT: 'UAT'
            }
        }]
    ],

    before: function (capabilities, specs) {
        // Add report name and metadata
        const allure = require('@wdio/allure-reporter').default;
        allure.addFeature('Mobile Automation');
        allure.addEnvironment('App Package', 'com.roava.app');
        allure.addEnvironment('Platform', 'Android');
        allure.addEnvironment('Environment', 'PROD');
    },

    afterTest: async function(test, context, { error, result, duration, passed, retries }) {
        if (error) {
            await browser.takeScreenshot();
            
            // Only reset app if test failed
            try {
                const appPackage = 'com.roava.app'; // Replace with actual package
                await driver.terminateApp(appPackage);
                await browser.pause(3000); // Allow system to cleanup
                await driver.activateApp(appPackage);
                await browser.pause(5000); // Allow app to fully launch
                console.log("✓ App reset completed after failure");
            } catch (err) {
                console.log("Warning: App reset failed:", err.message);
            }
        }
    },

    mochaOpts: {
        ui: 'bdd',
        timeout: 8000000
    }
};
