const {prodUser} = require("../../config/users.js");
const { autoAcceptPermissions, hideKeyboardIfVisible, safeClick, safeSetValue, savePageSourceForDebug, performFullLogin } = require("../../config/testUtils.js");

describe("Account Management", () => {
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
                await driver.deleteSession();
                console.log("✅ Driver session terminated successfully");
            }
        } catch (error) {
            console.error("❌ Error in cleanup:", error.message);
        }
    });

    it("should update phone number and email address", async () => {
        try {
            await autoAcceptPermissions(driver);
            await browser.pause(7000);
            
            // ============ LOGIN FLOW ============
            console.log("🚀 Starting login flow...");
            
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
                        // Skip to account management section
                        console.log("🔄 Proceeding to account management...");
                    }
                } else {
                    // Full login flow if not already logged in
                    await performFullLogin(driver, prodUser);
                }
            } catch (error) {
                console.log("No initial passcode field - continuing to full login flow");
                await performFullLogin(driver, prodUser);
            }

            // ============ ACCOUNT MANAGEMENT FLOW ============
            console.log("📱 Starting account management flow...");
            
            // Step 1: Click on profile (SO)
            const profile = await driver.$("accessibility id:SO");
            await profile.waitForDisplayed({ timeout: 10000 });
            await profile.click();
            console.log("✅ Clicked on profile");
            
            // Step 2: Click on Personal details
            await browser.pause(2000);
            const personal_details = await driver.$("-android uiautomator:new UiSelector().descriptionContains(\"Personal details\")");
            await personal_details.waitForDisplayed({ timeout: 10000 });
            await personal_details.click();
            console.log("✅ Clicked on Personal details");
            
            // Step 3: Click on Update personal details
            await browser.pause(2000);
            const update_details = await driver.$("accessibility id:Update personal details");
            await update_details.waitForDisplayed({ timeout: 10000 });
            await update_details.click();
            console.log("✅ Clicked on Update personal details");
            
            // ============ UPDATE PHONE NUMBER ============
            console.log("📞 Starting phone number update...");
            
            // Step 4: Click on Mobile number update
            await browser.pause(2000);
            const phone_number = await driver.$("-android uiautomator:new UiSelector().resourceId(\"Mobile number\")");
            await phone_number.waitForDisplayed({ timeout: 10000 });
            await phone_number.click();
            console.log("✅ Clicked on Mobile number update");
            
            // Step 5: Enter new phone number
            await browser.pause(2000);
            const phone_number_field = await driver.$("class name:android.widget.EditText");
            await phone_number_field.waitForDisplayed({ timeout: 10000 });
            await phone_number_field.click();
            await phone_number_field.addValue('6543216543');
            console.log(`✅ Entered new phone number: 6543216543`);
            
            // Step 6: Click Continue for phone number
            await browser.pause(1000);
            const continueBtn = await driver.$("accessibility id:Continue");
            await continueBtn.waitForDisplayed({ timeout: 10000 });
            await continueBtn.click();
            console.log("✅ Clicked Continue for phone number");
            
            // Step 7: Enter OTP for phone number
            await browser.pause(2000);
            const otpField = await driver.$("class name:android.widget.EditText");
            await otpField.waitForDisplayed({ timeout: 10000 });
            await otpField.click();
            await otpField.addValue(prodUser.otp);
            console.log(`✅ Entered OTP: ${prodUser.otp}`);
            
            // Step 8: Click Done for phone number update
            await browser.pause(1000);
            const done = await driver.$("accessibility id:Done");
            await done.waitForDisplayed({ timeout: 10000 });
            await done.click();
            console.log("✅ Clicked Done for phone number update");
            
            // Step 9: Confirm phone number update
            await browser.pause(2000);
            const yesButton = await driver.$("accessibility id:Yes");
            await yesButton.waitForDisplayed({ timeout: 10000 });
            await yesButton.click();
            console.log("✅ Confirmed phone number update");
            
            // ============ UPDATE EMAIL ADDRESS ============
            console.log("📧 Starting email address update...");
            
            // Step 10: Click on Email address update
            await browser.pause(3000);
            const emailUpdate = await driver.$("-android uiautomator:new UiSelector().resourceId(\"Email address\")");
            await emailUpdate.waitForDisplayed({ timeout: 10000 });
            await emailUpdate.click();
            console.log("✅ Clicked on Email address update");
            
            // Step 11: Enter new email address
            await browser.pause(2000);
            const email = await driver.$("class name:android.widget.EditText");
            await email.waitForDisplayed({ timeout: 10000 });
            await email.click();
            await email.addValue('bash@gmail.com');
            console.log(`✅ Entered new email: bash@gmail.com`);
            
            // Step 12: Click Continue for email
            await browser.pause(1000);
            await continueBtn.waitForDisplayed({ timeout: 10000 });
            await continueBtn.click();
            console.log("✅ Clicked Continue for email");
            
            // Step 13: Click Enter code
            await browser.pause(2000);
            const enter_code = await driver.$("accessibility id:Enter code");
            await enter_code.waitForDisplayed({ timeout: 10000 });
            await enter_code.click();
            console.log("✅ Clicked Enter code");
            
            // Step 14: Enter verification code
            await browser.pause(2000);
            const verificationCodeField = await driver.$("class name:android.widget.EditText");
            await verificationCodeField.waitForDisplayed({ timeout: 10000 });
            await verificationCodeField.click();
            await verificationCodeField.addValue(prodUser.otp);
            console.log(`✅ Entered verification code: ${prodUser.otp}`);
            
            // Step 15: Enter email confirmation
            await browser.pause(4000);
            const login_email = await driver.$("-android uiautomator:new UiSelector().resourceId(\"email_address_input_field\")");
            await login_email.waitForDisplayed({ timeout: 10000 });
            await login_email.click();
            await login_email.addValue('bash@gmail.com');
            console.log(`✅ Confirmed email: bash@gmail.com`);
            
            // Step 16: Click Continue for email confirmation
            await browser.pause(1000);
            await continueBtn.waitForDisplayed({ timeout: 10000 });
            await continueBtn.click();
            console.log("✅ Clicked Continue for email confirmation");
            
            // Step 17: Enter passcode for final confirmation // Check this
            await browser.pause(2000);
            const el17 = await driver.$("-android uiautomator:new UiSelector().resourceId(\"Pin Input Identifier\")");
            await el17.waitForDisplayed({ timeout: 10000 });
            await el17.click();
            await el17.addValue(prodUser.passcode);
            console.log("✅ Entered passcode for final confirmation");

            // Step 18: Click on profile (SO) again
            await profile.waitForDisplayed({ timeout: 10000 });
            await profile.click();
            console.log("✅ Clicked on profile");
            
            // Step 19: Click on Personal details
            await browser.pause(2000);
            await personal_details.waitForDisplayed({ timeout: 10000 });
            await personal_details.click();
            console.log("✅ Clicked on Personal details");
            
            // Step 20: Click on Update personal details
            await browser.pause(2000);
            await update_details.waitForDisplayed({ timeout: 10000 });
            await update_details.click();
            console.log("✅ Clicked on Update personal details");
            
            // ============ UPDATE PHONE NUMBER ============
            console.log("📞 Starting phone number update...");
            
            // Step 21: Click on Mobile number update
            await browser.pause(2000);
            await phone_number.waitForDisplayed({ timeout: 10000 });
            await phone_number.click();
            console.log("✅ Clicked on Mobile number update");
            
            // Step 22: Enter new phone number
            await browser.pause(2000);
            await phone_number_field.waitForDisplayed({ timeout: 10000 });
            await phone_number_field.click();
            await phone_number_field.addValue(prodUser.phoneNumber);
            console.log(`✅ Entered new phone number: ${prodUser.phoneNumber}`);
            
            // Step 23: Click Continue for phone number
            await browser.pause(1000);
            await continueBtn.waitForDisplayed({ timeout: 10000 });
            await continueBtn.click();
            console.log("✅ Clicked Continue for phone number");
            
            // Step 24: Enter OTP for phone number
            await browser.pause(2000);
            await otpField.waitForDisplayed({ timeout: 10000 });
            await otpField.click();
            await otpField.addValue(prodUser.otp);
            console.log(`✅ Entered OTP: ${prodUser.otp}`);
            
            // Step 25: Click Done for phone number update
            await browser.pause(1000);
            await done.waitForDisplayed({ timeout: 10000 });
            await done.click();
            console.log("✅ Clicked Done for phone number update");
            
            // Step 26: Confirm phone number update
            await browser.pause(2000);
            await yesButton.waitForDisplayed({ timeout: 10000 });
            await yesButton.click();
            console.log("✅ Confirmed phone number update");
            
            // ============ UPDATE EMAIL ADDRESS ============
            console.log("📧 Starting email address update...");
            
            // Step 27: Click on Email address update
            await browser.pause(3000);
            await emailUpdate.waitForDisplayed({ timeout: 10000 });
            await emailUpdate.click();
            console.log("✅ Clicked on Email address update");
            
            // Step 28: Enter new email address
            await browser.pause(2000);
            await email.waitForDisplayed({ timeout: 10000 });
            await email.click();
            await email.addValue(prodUser.email);
            console.log(`✅ Entered new email: ${prodUser.email}`);
            
            // Step 29: Click Continue for email
            await browser.pause(1000);
            await continueBtn.waitForDisplayed({ timeout: 10000 });
            await continueBtn.click();
            console.log("✅ Clicked Continue for email");
            
            // Step 30: Click Enter code
            await browser.pause(2000);
            await enter_code.waitForDisplayed({ timeout: 10000 });
            await enter_code.click();
            console.log("✅ Clicked Enter code");
            
            // Step 31: Enter verification code
            await browser.pause(2000);
            await verificationCodeField.waitForDisplayed({ timeout: 10000 });
            await verificationCodeField.click();
            await verificationCodeField.addValue(prodUser.otp);
            console.log(`✅ Entered verification code: ${prodUser.otp}`);
            
            // Step 32: Verify that Email text field is visible
            await browser.pause(3000);
            const emailTextField = await driver.$("-android uiautomator:new UiSelector().resourceId(\"email_address_input_field\")");
            await emailTextField.waitForDisplayed({ timeout: 5000 });
            const isEmailFieldVisible = await emailTextField.isDisplayed();
            if (isEmailFieldVisible) {
                console.log("✅ Verified: Email text field is visible");
            } else {
                throw new Error("❌ Email text field is not visible");
            }
            console.log("🎉 Account details update completed successfully!");
            
        } catch (error) {
            console.error("❌ Account update test failed:", error.message);
            await savePageSourceForDebug(driver, "account_update_error");
            throw error; // Re-throw to fail the test
        }
    });
});