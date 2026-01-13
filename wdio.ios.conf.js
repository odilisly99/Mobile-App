const iosCapabilities = {
    // !!! IMPORTANT: Replace with your iOS app's Bundle ID !!!
    "appium:bundleId": "com.rova.ios", 
    "appium:automationName": "XCUITest",
    "platformName": "iOS",
    "appium:noReset": true,
    "appium:newCommandTimeout": 15000
};

// === 2. Define Platform-Specific Allure Output ===
// This gives you 'allure-results-android' or 'allure-results-ios'
const allureOutputDir = `allure-results-ios`;

exports.config = {
    runner: 'local',
    
    // ===================================
    // === KEY DEVICE FARM FIX (Port) ===
    // ===================================
    // This is correct. Connects to the Appium server started by the test spec.
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
    // This now dynamically selects the correct capability object
    capabilities: [iosCapabilities], 
    
    // ===================================
    // === KEY DEVICE FARM FIX (Service) ===
    // ===================================
    // This is correct. DO NOT start the appium service on Device Farm.
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
            // This path is now dynamic!
            outputDir: allureOutputDir, 
            disableWebdriverStepsReporting: true,
            disableWebdriverScreenshotsReporting: false,
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