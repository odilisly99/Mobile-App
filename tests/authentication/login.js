const otplib = require('otplib');
const {prodUser} = require("../../config/users.js");
const {clickWithDialogHandling} = require("../../utils/clickProxy.js");
const { runPlaywrightTest } = require("../../utils/playwrightRunner.js");

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

describe("Launch Rova app", () => {
    // Cleanup after each test to ensure fresh start on failure
    afterEach(async function() {
        if (this.currentTest.state === 'failed') {
            console.log("⚠️ Test failed - terminating session for fresh start");
            try {
                await driver.terminateApp('com.rova.app'); // Replace with actual app package
                await driver.deleteSession();
                console.log("✅ Driver session terminated successfully");
            } catch (error) {
                console.error("❌ Error terminating session:", error.message);
            }
        }
    });

    it("and successfully login to the app", async () => {
        try {
            await autoAcceptPermissions(driver);
            await browser.pause(7000);
            
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
                        return; // Exit early if already logged in
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
            // await hideKeyboardIfVisible(driver);
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
            
            // Verify dashboard is visible
            const profile = await driver.$("accessibility id:SO");
            await browser.pause(5000);
            await profile.waitForDisplayed({ timeout: 15000 });
            
            if (await profile.isDisplayed()) {
                console.log("✅ Dashboard is visible - Login successful!");
            } else {
                throw new Error("❌ Test failed: Dashboard is not visible after login");
            }
            
        } catch (error) {
            console.error("❌ Login test failed:", error.message);
            
            // Save page source for debugging
            try {
                const fs = require('fs');
                const path = require('path');
                const pageSource = await driver.getPageSource();
                const sourcesDir = path.join(__dirname, '../../sources');
                
                if (!fs.existsSync(sourcesDir)) {
                    fs.mkdirSync(sourcesDir, { recursive: true });
                }
                
                const errorFile = path.join(sourcesDir, 'login_error.xml');
                fs.writeFileSync(errorFile, pageSource, 'utf8');
                console.log(`📁 Error page source saved to: ${errorFile}`);
            } catch (saveError) {
                console.warn("Could not save error page source:", saveError.message);
            }
            
            throw error; // Re-throw to fail the test
        }
    });
});