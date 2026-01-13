

// Capabilities for Device Farm (minimal)
// The testspec.yml's --default-capabilities provides the device, app, etc.
// We just need to provide the package/activity to launch.
let deviceFarmCapabilities = [
    {
        "appium:appPackage": "com.roava.app",
        "appium:appActivity": "com.roava.app.MainActivity",
        "appium:automationName": "UiAutomator2",
        "platformName": "Android",
        "appium:noReset": true, // Match your local config
        "appium:newCommandTimeout": 15000 // Match your local config
    }
];

exports.config = {
    runner: 'local',
    
    // ===================================
    // === KEY DEVICE FARM FIX (Port) ===
    // ===================================
    // If on Device Farm, connect to the server started by the testspec.
    // Otherwise, connect to the one started by `services: ['appium']`.
    hostname: '0.0.0.0',
    port: 4723, // Always 4723
    path:  '/wd/hub',
    // ===================================

    specs: process.env.TEST_SUITE_PATH 
        ? [process.env.TEST_SUITE_PATH]
        : ["./device_farm_tests/**/*.js"],
    
    maxInstances: 1,

    // ===================================
    // === KEY DEVICE FARM FIX (Caps) ===
    // ===================================
    capabilities:  deviceFarmCapabilities ,
    
    // ===================================
    // === KEY DEVICE FARM FIX (Service) ===
    // ===================================
    // DO NOT start the appium service on Device Farm.
    // The testspec.yml already started it.
    services: [],
    
    logLevel: 'info',
    bail: 0,
    waitforTimeout: 10000,
    connectionRetryTimeout: 800000,
    connectionRetryCount: 3,
    framework: 'mocha',
    
    // Retry configuration for failed tests
    specFileRetries: 1,
    specFileRetriesDelay: 0,
    specFileRetriesDeferred: false,
    
    reporters: [
        'spec',
        ['allure', {
            // This path now works perfectly with your post_test copy command
            outputDir: 'allure-results-android', 
            disableWebdriverStepsReporting: true,
            disableWebdriverScreenshotsReporting: false,
            // ... (rest of your reporter config)
        }]
    ],

    afterTest: async function(test, context, { error, result, duration, passed, retries }) {
        if (error) {
            await browser.takeScreenshot();
        }

    },
    
    mochaOpts: {
        ui: 'bdd',
        timeout: 8000000
    }
};