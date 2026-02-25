const {prodUser} = require("../../config/users.js");
const { autoAcceptPermissions, hideKeyboardIfVisible, safeClick, safeSetValue, savePageSourceForDebug, performFullLogin } = require("../../config/testUtils.js");

describe("Reset Passcode", () => {
    // Cleanup before and after each test to ensure fresh start
    beforeEach(async function() {
        try {
            console.log("🔄 Preparing test environment...");
            // Ensure app is terminated before starting
            await driver.terminateApp('com.roava.app');
            await browser.pause(2000);
            console.log("✅ App terminated, ready for fresh start");
        } catch (error) {
            console.warn("⚠️ Error in beforeEach setup:", error.message);
        }
    });

    afterEach(async function() {
        try {
            console.log("🧹 Cleaning up after test...");
            await driver.terminateApp('com.roava.app');
            await browser.pause(2000);
            console.log("✅ App terminated successfully");
            
            if (this.currentTest.state === 'failed') {
                console.log("⚠️ Test failed - performing additional cleanup");
                console.log("Skipping driver.deleteSession(); WDIO will manage the session lifecycle.");
            }
        } catch (error) {
            console.error("❌ Error in cleanup:", error.message);
        }
    });

    it("should successfully reset user passcode through forgot passcode flow", async () => {
        try {
            // Step 1: Clear app data and start fresh to ensure we're on login screen
            console.log("🔄 Clearing app data for fresh start...");
            await driver.terminateApp('com.roava.app');
            await browser.pause(2000);
            
            // Clear app data to ensure fresh state
            try {
                if (process.env.BROWSERSTACK_USERNAME || process.env.BROWSERSTACK_ACCESS_KEY) {
                    console.log("Skipping mobile:clearApp on BrowserStack; continuing with current app state.");
                } else {
                    await driver.execute('mobile:clearApp', { appId: 'com.roava.app' });
                    console.log("✅ App data cleared");
                }
            } catch (error) {
                console.log("⚠️ Could not clear app data, continuing...");
            }
            
            // Launch app fresh
            await driver.activateApp('com.roava.app');
            console.log("📱 App launched fresh");
            
            // Accept permissions but don't auto-login
            await autoAcceptPermissions(driver);
            await browser.pause(5000);
            
            // Navigate to login screen if we see Get Started
            try {
                const getStarted = await driver.$("-android uiautomator:new UiSelector().description(\"Get started\")");
                if (await getStarted.isDisplayed()) {
                    await getStarted.click();
                    console.log("✅ Clicked Get started");
                    
                    const logIn = await driver.$("-android uiautomator:new UiSelector().description(\"Log in\")");
                    await logIn.waitForDisplayed({ timeout: 10000 });
                    await logIn.click();
                    console.log("✅ Clicked Log in");
                }
            } catch (error) {
                console.log("Already at login screen");
            }
            
            // ============ RESET PASSCODE FLOW ============
            console.log("🔐 Starting reset passcode flow...");
            
            // Step 2: Enter email if needed
            await browser.pause(3000);
            try {
                const email = await driver.$("-android uiautomator:new UiSelector().resourceId(\"email_address_input_field\")");
                if (await email.isDisplayed()) {
                    await email.click();
                    await email.setValue(prodUser.email);
                    console.log(`✅ Entered email: ${prodUser.email}`);
                    
                    const continueButton = await driver.$("accessibility id:Continue");
                    await continueButton.waitForDisplayed({ timeout: 2000 });
                    await continueButton.click();
                    console.log("✅ Clicked Continue");
                }
            } catch (error) {
                console.log("Email field not needed or already filled");
            }
            
            // Step 3: Click on "Forgot passcode?" link
            await browser.pause(3000);
            const forgotPasscode = await driver.$("accessibility id:Forgot passcode?");
            await forgotPasscode.waitForDisplayed({ timeout: 10000 });
            await forgotPasscode.click();
            console.log("✅ Clicked Forgot passcode?");
            
            // Step 4: Click on "Reset Passcode"
            await browser.pause(2000);
            const resetPasscode = await driver.$("accessibility id:Reset Passcode");
            await resetPasscode.waitForDisplayed({ timeout: 10000 });
            await resetPasscode.click();
            console.log("✅ Clicked Reset Passcode");
            
            // Step 5: Enter email address
            await browser.pause(2000);
            const emailField = await driver.$("class name:android.widget.EditText");
            await emailField.waitForDisplayed({ timeout: 10000 });
            await emailField.click();
            await emailField.addValue("remit002@yopmail.com");
            console.log("✅ Entered email: remit002@yopmail.com");
            
            // Step 6: Click Continue
            await browser.pause(1000);
            const continueBtn = await driver.$("accessibility id:Continue");
            await continueBtn.waitForDisplayed({ timeout: 10000 });
            await continueBtn.click();
            console.log("✅ Clicked Continue");
            
            // Step 7: Click "Enter code"
            await browser.pause(2000);
            const enterCode = await driver.$("accessibility id:Enter code");
            await enterCode.waitForDisplayed({ timeout: 10000 });
            await enterCode.click();
            console.log("✅ Clicked Enter code");
            
            // Step 8: Enter verification code (first field)
            await browser.pause(2000);
            const verificationField1 = await driver.$("class name:android.widget.EditText");
            await verificationField1.waitForDisplayed({ timeout: 10000 });
            await verificationField1.click();
            await verificationField1.addValue(prodUser.otp);
            console.log(`✅ Entered verification code (first field): ${prodUser.otp}`);
            
            // Step 9: Enter verification code (second field)
            await browser.pause(4000);
            const verificationField2 = await driver.$("class name:android.widget.EditText");
            await verificationField2.addValue(prodUser.otp);
            console.log(`✅ Entered verification code (second field): ${prodUser.otp}`);
            
            // Step 10: Click "Setup passcode"
            await browser.pause(1000);
            const setupPasscode = await driver.$("accessibility id:Setup passcode");
            await setupPasscode.waitForDisplayed({ timeout: 10000 });
            await setupPasscode.click();
            console.log("✅ Clicked Setup passcode");
            
            // Step 11: Enter new passcode (first field)
            await browser.pause(2000);
            const newPasscodeField1 = await driver.$("class name:android.widget.EditText");
            await newPasscodeField1.waitForDisplayed({ timeout: 10000 });
            await newPasscodeField1.click();
            await newPasscodeField1.addValue("123333");
            console.log("✅ Entered new passcode (first field): 123333");
            
            // Step 12: Enter new passcode (second field)
            await browser.pause(1000);
            const newPasscodeField2 = await driver.$("class name:android.widget.EditText");
            await newPasscodeField2.click();
            await newPasscodeField2.addValue("123333");
            console.log("✅ Entered new passcode (second field): 123333");
            
            // Step 13: Verify Done button is visible (don't click)
            await browser.pause(2000);
            const doneButton = await driver.$("accessibility id:Done");
            await doneButton.waitForDisplayed({ timeout: 10000 });
            
            if (await doneButton.isDisplayed()) {
                console.log("🎉 Done button is visible - Passcode reset flow completed successfully!");
            } else {
                throw new Error("❌ Done button not visible after passcode setup");
            }
            
            console.log("📝 Note: Passcode reset flow validated successfully");
            
        } catch (error) {
            console.error("❌ Reset passcode test failed:", error.message);
            await savePageSourceForDebug(driver, "reset_passcode_error");
            throw error; // Re-throw to fail the test
        }
    });
});
