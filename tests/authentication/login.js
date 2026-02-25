const otplib = require('otplib');
const {prodUser} = require("../../config/users.js");
const {clickWithDialogHandling} = require("../../utils/clickProxy.js");
const { runPlaywrightTest } = require("../../utils/playwrightRunner.js");
const { autoAcceptPermissions, hideKeyboardIfVisible, savePageSourceForDebug, performFullLogin } = require("../../config/testUtils.js");

describe("Launch Rova app", () => {
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

    it("and successfully login to the app", async () => {
        try {
            await performFullLogin(driver, prodUser);
        } catch (error) {
            console.error("❌ Login test failed:", error.message);
            await savePageSourceForDebug(driver, 'login_error');
            throw error; // Re-throw to fail the test
        }
    });
});