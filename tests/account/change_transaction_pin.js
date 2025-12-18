const {prodUser} = require("../../config/users.js");
const { autoAcceptPermissions, hideKeyboardIfVisible, safeClick, safeSetValue, savePageSourceForDebug, performFullLogin } = require("../../config/testUtils.js");

describe("Change Transaction PIN", () => {
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

    it("should successfully change user transaction PIN", async () => {
        try {
            // Step 1: Login to the app
            console.log("🚀 Starting transaction PIN change flow...");
            await performFullLogin(driver, prodUser);
            
            // Step 2: Click on SO profile
            console.log("Step 2: Clicking on SO profile...");
            const el14 = await driver.$("accessibility id:SO");
            await el14.click();
            console.log("✅ Clicked SO profile");
            
            // Step 3: Click on Security section
            console.log("Step 3: Clicking on Security section...");
            const el15 = await driver.$("-android uiautomator:new UiSelector().description(\"Security\\nApp login, passcode\")");
            await el15.click();
            console.log("✅ Clicked Security section");
            
            // Step 4: Click on Change transaction PIN option
            console.log("Step 4: Clicking on Change transaction PIN...");
            const el16 = await driver.$("-android uiautomator:new UiSelector().description(\"**|\\nChange transaction PIN\")");
            await el16.click();
            console.log("✅ Clicked Change transaction PIN");
            
            // Step 5: Enter current transaction PIN
            console.log("Step 5: Entering current transaction PIN...");
            const el17 = await driver.$("class name:android.widget.EditText");
            await el17.click();
            await el17.addValue(prodUser.pin);
            console.log("✅ Entered current transaction PIN");
            
            // Step 6: Enter new transaction PIN
            console.log("Step 6: Entering new transaction PIN...");
            const el18 = await driver.$("class name:android.widget.EditText");
            await el18.click();
            await el18.addValue("2588");
            console.log("✅ Entered new transaction PIN");
            
            // Step 7: Confirm new transaction PIN
            console.log("Step 7: Confirming new transaction PIN...");
            const el19 = await driver.$("class name:android.widget.EditText");
            await el19.click();
            await el19.addValue("2588");
            console.log("✅ Confirmed new transaction PIN");
            
            // Step 8: Click Continue
            console.log("Step 8: Verifying Continue button is visible...");
            const el13 = await driver.$("accessibility id:Continue");
            await el13.waitForDisplayed({ timeout: 10000 });
            console.log("✅ Verified Continue button is visible");
            
            console.log("✅ Transaction PIN change flow completed successfully");
            
        } catch (error) {
            console.error("❌ Transaction PIN change test failed:", error.message);
            await savePageSourceForDebug(driver, "change_transaction_pin_error");
            throw error; // Re-throw to fail the test
        }
    });
});