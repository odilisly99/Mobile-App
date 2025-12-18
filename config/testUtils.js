/**
 * Common utility functions for mobile automation tests
 * These functions handle common mobile app interactions like permissions and keyboard management
 */

/**
 * Automatically accept system permission dialogs
 * Handles common permission prompts like location, camera, etc.
 * @param {Object} driver - WebDriverIO driver instance
 */
const autoAcceptPermissions = async (driver) => {
    try {
        // Wait for 3 seconds to see if a permission dialog appears
        const allowButton = await driver.$('android=new UiSelector().className("android.widget.Button").textMatches("(?i)Allow|(?i)While using the app")');
        await allowButton.waitForDisplayed({ timeout: 3000 });
        await allowButton.click();
        console.log("Auto-accepted system permission.");
    } catch (error) {
        // No permission dialog found, which is fine.
        console.log("No system permission dialog found, continuing...");
    }
};

/**
 * Hide keyboard if it's currently visible
 * Prevents keyboard from interfering with element interactions
 * @param {Object} driver - WebDriverIO driver instance
 */
const hideKeyboardIfVisible = async (driver) => {
    try {
        if (await driver.isKeyboardShown()) {
            await driver.hideKeyboard();
            console.log("Keyboard was visible and is now hidden.");
        } else {
            console.log("Keyboard was not visible, no action taken.");
        }
    } catch (error) {
        // Log any errors, but don't fail the test
        console.warn("Could not check or hide keyboard:", error.message);
    }
};

/**
 * Wait for element and perform click with error handling
 * @param {Object} element - WebDriverIO element
 * @param {number} timeout - Timeout in milliseconds (default: 10000)
 */
const safeClick = async (element, timeout = 10000) => {
    try {
        await element.waitForDisplayed({ timeout });
        await element.click();
        return true;
    } catch (error) {
        console.warn(`Safe click failed: ${error.message}`);
        return false;
    }
};

/**
 * Clear field and set new value with keyboard handling
 * @param {Object} element - WebDriverIO element
 * @param {string} value - Value to set
 * @param {Object} driver - WebDriverIO driver instance
 */
const safeSetValue = async (element, value, driver) => {
    try {
        await element.click();
        await element.clearValue();
        await element.setValue(value);
        await hideKeyboardIfVisible(driver);
        return true;
    } catch (error) {
        console.warn(`Safe set value failed: ${error.message}`);
        return false;
    }
};

/**
 * Save page source for debugging purposes
 * @param {Object} driver - WebDriverIO driver instance
 * @param {string} filename - Name of the file to save (without extension)
 */
const savePageSourceForDebug = async (driver, filename) => {
    try {
        const fs = require('fs');
        const path = require('path');
        const pageSource = await driver.getPageSource();
        const sourcesDir = path.join(__dirname, '../sources');
        
        if (!fs.existsSync(sourcesDir)) {
            fs.mkdirSync(sourcesDir, { recursive: true });
        }
        
        const errorFile = path.join(sourcesDir, `${filename}.xml`);
        fs.writeFileSync(errorFile, pageSource, 'utf8');
        console.log(`📁 Page source saved to: ${errorFile}`);
        return errorFile;
    } catch (error) {
        console.warn("Could not save page source:", error.message);
        return null;
    }
};

/**
 * Complete login flow with device change handling
 * Handles the full authentication process including device registration if needed
 * @param {Object} driver - WebDriverIO driver instance
 * @param {Object} prodUser - User credentials object containing email, passcode, phoneNumber, otp
 * @returns {boolean} - True if login successful, throws error if failed
 */
const performFullLogin = async (driver, prodUser) => {
    try {
        console.log("🔐 Performing full login flow...");
        
        // First ensure the app is launched
        try {
            await driver.activateApp('com.roava.app');
            console.log("📱 App activation attempted");
            await browser.pause(3000);
        } catch (error) {
            console.log("App activation failed, may already be running");
        }
        
        await autoAcceptPermissions(driver);
        await browser.pause(7000);
        
        // Check if we're on home screen and need to launch app manually
        try {
            const rovaApp = await driver.$("accessibility id:Rova");
            if (await rovaApp.isDisplayed()) {
                console.log("📱 Launching Rova app from home screen");
                await rovaApp.click();
                await browser.pause(5000);
            }
        } catch (error) {
            console.log("App icon not found on home screen, continuing...");
        }
        
        // Check if passcode field is already visible (user already logged in)
        const passcode = await driver.$("-android uiautomator:new UiSelector().resourceId(\"Pin Input Identifier\")");
        try {
            if (await passcode.isDisplayed()) {
                console.log("Passcode field detected - entering passcode");
                await passcode.click();
                await passcode.setValue(prodUser.passcode);
                await hideKeyboardIfVisible(driver);
                
                // Wait for dashboard after initial passcode
                await browser.pause(5000);
                const profile = await driver.$("accessibility id:SO");
                if (await profile.isDisplayed()) {
                    console.log("✅ Dashboard is visible after passcode entry");
                    return true; // Exit early if already logged in
                }
            }
        } catch (error) {
            console.log("No initial passcode field - continuing to full login flow");
        }

        // Full login flow
        const getStarted = await driver.$("-android uiautomator:new UiSelector().description(\"Get started\")");
        await getStarted.waitForDisplayed({ timeout: 10000 });
        await getStarted.click();
        await browser.pause(1000);
        console.log("✅ Clicked Get started");

        const logIn = await driver.$("-android uiautomator:new UiSelector().description(\"Log in\")");
        await logIn.waitForDisplayed({ timeout: 10000 });
        await logIn.click();
        console.log("✅ Clicked Log in");
        
        // Enter email
        await browser.pause(3000);
        const email = await driver.$("-android uiautomator:new UiSelector().resourceId(\"email_address_input_field\")");
        await email.waitForDisplayed({ timeout: 10000 });
        await email.click();
        await email.setValue(prodUser.email);
        await browser.pause(1000);
        console.log(`✅ Entered email: ${prodUser.email}`);
        
        // Click continue
        const continueButton = await driver.$("accessibility id:Continue");
        await continueButton.waitForDisplayed({ timeout: 2000 });
        await continueButton.click();
        console.log("✅ Clicked Continue");
        
        // Enter passcode
        await browser.pause(3000);
        await passcode.waitForDisplayed({ timeout: 10000 });
        await passcode.click();
        await browser.pause(1000);
        await passcode.setValue(prodUser.passcode);
        await hideKeyboardIfVisible(driver);
        console.log("✅ Entered passcode");

        // Handle device change flow if prompted
        try {
            const yesButton = await driver.$("accessibility id:Yes");
            if (await yesButton.isDisplayed()) {
                console.log("🔄 Device change prompt detected - proceeding with device registration");
                
                await yesButton.click();
                console.log("✅ Clicked Yes for device change");
                
                // passcode should be here
                await passcode.click();
                await passcode.addValue(prodUser.passcode);
                console.log("✅ Entered first field value");
                
                const phone = await driver.$("-android uiautomator:new UiSelector().resourceId(\"phone_number_textfield_input\")");
                await browser.pause(1000);
                await phone.click();
                await phone.addValue(prodUser.phoneNumber);
                console.log("✅ Entered phone number");
                
                await continueButton.click();
                console.log("✅ Clicked Continue after form");
                
                const otp = await driver.$("class name:android.widget.EditText");
                await browser.pause(1000);
                await otp.click();
                await otp.addValue(prodUser.otp);
                console.log("✅ Entered verification code");
                
                await browser.pause(1000);
                await continueButton.click();
                console.log("✅ Clicked Continue after verification");
                
                await autoAcceptPermissions(driver);
                console.log("✅ Granted permissions");

                // Enter passcode
                await browser.pause(3000);
                await passcode.waitForDisplayed({ timeout: 10000 });
                await passcode.click();
                await browser.pause(1000);
                await passcode.setValue(prodUser.passcode);
                await hideKeyboardIfVisible(driver);
                console.log("✅ Entered passcode");
                
                console.log("🎉 Device change flow completed successfully");
            } else {
                console.log("ℹ️ No device change prompt - proceeding to dashboard verification");
            }
        } catch (error) {
            console.log("ℹ️ Device change flow not required or failed:", error.message);
        }
        
        // Verify dashboard is visible
        const profile = await driver.$("accessibility id:SO");
        await browser.pause(5000);
        await profile.waitForDisplayed({ timeout: 15000 });
        
        if (await profile.isDisplayed()) {
            console.log("✅ Dashboard is visible - Login successful!");
            return true;
        } else {
            throw new Error("❌ Test failed: Dashboard is not visible after login");
        }
        
    } catch (error) {
        console.error("❌ Login flow failed:", error.message);
        await savePageSourceForDebug(driver, 'login_flow_error');
        throw error;
    }
};

module.exports = {
    autoAcceptPermissions,
    hideKeyboardIfVisible,
    safeClick,
    safeSetValue,
    savePageSourceForDebug,
    performFullLogin
};