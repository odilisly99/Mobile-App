const {prodUser} = require("../../config/users.js");
const { autoAcceptPermissions, hideKeyboardIfVisible, safeClick, safeSetValue, savePageSourceForDebug, performFullLogin } = require("../../config/testUtils.js");

describe("Reset Transaction PIN", () => {
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

    // Always close app after test completion
    after(async function() {
        console.log("🔚 Closing app after test completion...");
        try {
            await driver.terminateApp('com.roava.app');
            console.log("✅ App terminated successfully");
        } catch (error) {
            console.error("❌ Error terminating app:", error.message);
        }
    });

    it("should successfully reset user transaction PIN through forgot PIN flow", async () => {
        try {
            // Step 1: Login to the app
            console.log("🚀 Starting transaction PIN reset flow...");
            await performFullLogin(driver, prodUser);
            
            // Step 2: Click on SO profile
            console.log("Step 2: Clicking on SO profile...");
            const el4 = await driver.$("accessibility id:SO");
            await el4.click();
            console.log("✅ Clicked SO profile");
            
            // Step 3: Click on Security section
            console.log("Step 3: Clicking on Security section...");
            const el5 = await driver.$("-android uiautomator:new UiSelector().description(\"Security\\nApp login, passcode\")");
            await el5.click();
            console.log("✅ Clicked Security section");
            
            // Step 4: Click on Change transaction PIN option
            console.log("Step 4: Clicking on Change transaction PIN...");
            const el6 = await driver.$("-android uiautomator:new UiSelector().description(\"**|\\nChange transaction PIN\")");
            await el6.click();
            console.log("✅ Clicked Change transaction PIN");
            
            // Step 5: Click on Forgot your transaction PIN
            console.log("Step 5: Clicking on Forgot your transaction PIN...");
            const el7 = await driver.$("accessibility id:Forgot your transaction PIN?");
            await el7.click();
            console.log("✅ Clicked Forgot your transaction PIN");
            
            // Step 6: Click on Reset Transaction PIN
            console.log("Step 6: Clicking on Reset Transaction PIN...");
            const el8 = await driver.$("accessibility id:Reset Transaction PIN");
            await el8.click();
            console.log("✅ Clicked Reset Transaction PIN");
            
            // Step 7: Enter current PIN (first field)
            console.log("Step 7: Entering OTP...");
            const el9 = await driver.$("class name:android.widget.EditText");
            await el9.click();
            await el9.addValue(prodUser.otp);
            console.log("✅ Entered current PIN in first field");
            
            // Step 8: Confirm current PIN (second field)
            console.log("Step 8: Entering OTP...");
            const el10 = await driver.$("class name:android.widget.EditText");
            await el10.click();
            await el10.addValue(prodUser.otp);
            console.log("✅ Confirmed current PIN in second field");
            
            // Step 9: Enter new PIN (third field)
            console.log("Step 9: Entering new PIN (third field)...");
            const el11 = await driver.$("class name:android.widget.EditText");
            await el11.click();
            await el11.addValue(prodUser.pin);
            console.log("✅ Entered new PIN in third field");
            
            // Step 10: Confirm new PIN (fourth field)
            console.log("Step 10: Confirming new PIN (fourth field)...");
            const el12 = await driver.$("class name:android.widget.EditText");
            await el12.click();
            await el12.addValue(prodUser.pin);
            console.log("✅ Confirmed new PIN in fourth field");
            
            // Step 11: Verify Continue button is visible
            console.log("Step 11: Verifying Continue button is visible...");
            const el13 = await driver.$("accessibility id:Continue");
            await el13.waitForDisplayed({ timeout: 10000 });
            console.log("✅ Verified Continue button is visible");
            
            console.log("✅ Transaction PIN reset flow completed successfully");
            
        } catch (error) {
            console.error("❌ Transaction PIN reset test failed:", error.message);
            await savePageSourceForDebug(driver, "reset_transaction_pin_error");
            throw error; // Re-throw to fail the test
        }
    });
});