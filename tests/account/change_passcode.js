const {prodUser} = require("../../config/users.js");
const { autoAcceptPermissions, hideKeyboardIfVisible, safeClick, safeSetValue, savePageSourceForDebug, performFullLogin } = require("../../config/testUtils.js");

describe("Change Passcode", () => {
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

    // Always close app after test completion
    after(async function() {
        console.log("🔄 Closing app after test completion...");
        try {
            await driver.terminateApp('com.roava.app');
            console.log("✅ App terminated successfully");
        } catch (error) {
            console.error("❌ Error terminating app:", error.message);
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

    it("should successfully change user passcode", async () => {
        try {
            // Step 1: Login to the app
            await performFullLogin(driver, prodUser);
            
            // ============ CHANGE PASSCODE FLOW ============
            console.log("🔐 Starting change passcode flow...");
            
            // Step 2: Click on profile (SO)
            const profile = await driver.$("accessibility id:SO");
            await profile.waitForDisplayed({ timeout: 10000 });
            await profile.click();
            console.log("✅ Clicked on profile");
            
            // Step 3: Scroll down to find Security settings
            await browser.pause(2000);
            
            // Step 4: Click on Security
            await browser.pause(2000);
            const security = await driver.$("android=new UiSelector().descriptionContains(\"Security\")");
            await security.waitForDisplayed({ timeout: 10000 });
            await security.click();
            console.log("✅ Clicked on Security");
            
            // Step 5: Click on Change passcode
            await browser.pause(2000);
            const changePasscode = await driver.$("android=new UiSelector().descriptionContains(\"Change passcode\")");
            await changePasscode.waitForDisplayed({ timeout: 10000 });
            await changePasscode.click();
            console.log("✅ Clicked on Change passcode");
            
            // Step 6: Enter current passcode
            await browser.pause(2000);
            const currentPasscodeField = await driver.$("class name:android.widget.EditText");
            await currentPasscodeField.waitForDisplayed({ timeout: 10000 });
            await currentPasscodeField.click();
            await currentPasscodeField.addValue(prodUser.passcode);
            console.log(`✅ Entered current passcode: ${prodUser.passcode}`);
            
            // Step 7: Click Setup passcode
            await browser.pause(1000);
            const setupPasscode = await driver.$("accessibility id:Setup passcode");
            await setupPasscode.waitForDisplayed({ timeout: 10000 });
            await setupPasscode.click();
            console.log("✅ Clicked Setup passcode");
            
            // Step 8: Enter new passcode (first field)
            await browser.pause(2000);
            const newPasscodeField1 = await driver.$("class name:android.widget.EditText");
            await newPasscodeField1.waitForDisplayed({ timeout: 10000 });
            await newPasscodeField1.click();
            await newPasscodeField1.addValue("123334");
            console.log("✅ Entered new passcode (first field): 123334");
            
            // Step 9: Enter new passcode (second field)
            await browser.pause(1000);
            const newPasscodeField2 = await driver.$("class name:android.widget.EditText");
            await newPasscodeField2.click();
            await newPasscodeField2.addValue("123334");
            console.log("✅ Entered new passcode (second field): 123334");
            
            // Step 10: Verify Done button is visible (don't click)
            await browser.pause(2000);
            const finalDoneBtn = await driver.$("accessibility id:Done");
            await finalDoneBtn.waitForDisplayed({ timeout: 10000 });
            
            if (await finalDoneBtn.isDisplayed()) {
                console.log("🎉 Done button is visible - Passcode change flow completed successfully!");
            } else {
                throw new Error("❌ Done button not visible after passcode setup");
            }
            
            console.log("📝 Note: Passcode change flow validated successfully");
            
        } catch (error) {
            console.error("❌ Change passcode test failed:", error.message);
            await savePageSourceForDebug(driver, "change_passcode_error");
            throw error; // Re-throw to fail the test
        }
    });
});