const {prodUser} = require("../../config/users.js");

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

const performLogin = async (driver) => {
    console.log("Starting login process...");
    
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
};

describe("Beneficiary Management", () => {
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

    it("should add and delete a beneficiary", async () => {
        try {
        // Step 1: Login
        await performLogin(driver);
        
        // Step 2: Navigate to Pay section
        console.log("Navigating to Pay section...");
        const payButton = await driver.$("accessibility id:Pay");
        await payButton.waitForDisplayed({ timeout: 10000 });
        await payButton.click();
        console.log("Clicked Pay button");
        
        // Step 3: Click on beneficiary management (ImageView instance 1)
        await browser.pause(2000);
        const send = await driver.$("-android uiautomator:new UiSelector().className(\"android.widget.ImageView\").instance(1)");
        await send.waitForDisplayed({ timeout: 5000 });
        await send.click();
        console.log("Clicked Send");
        
        // Step 4: Click Add button
        await browser.pause(2000);
        const addButton = await driver.$("accessibility id:Add");
        await addButton.waitForDisplayed({ timeout: 5000 });
        await addButton.click();
        console.log("Clicked Add button");
        
        // Step 5: Select "Add your own account"
        await browser.pause(2000);
        const addOwnAccount = await driver.$("-android uiautomator:new UiSelector().description(\"Add your own account\\nMake payments to an account in your name\")");
        await addOwnAccount.waitForDisplayed({ timeout: 5000 });
        await addOwnAccount.click();
        console.log("Selected 'Add your own account'");
        
        // Step 6: Enter account number (EditText instance 2)
        await browser.pause(2000);
        const accountNumberField = await driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(2)");
        await accountNumberField.waitForDisplayed({ timeout: 5000 });
        await accountNumberField.click();
        await accountNumberField.addValue("12345678");
        console.log("Entered account number: 12345678");
        
        // Step 7: Enter sort code (EditText instance 3)
        await browser.pause(1000);
        const sortCodeField = await driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(3)");
        await sortCodeField.waitForDisplayed({ timeout: 5000 });
        await sortCodeField.click();
        await sortCodeField.addValue("123456");
        await hideKeyboardIfVisible(driver);
        console.log("Entered sort code: 123456");
        
        // Step 8: Click Continue
        await browser.pause(2000);
        const continueBtn = await driver.$("accessibility id:Continue");
        await continueBtn.waitForDisplayed({ timeout: 5000 });
        await continueBtn.click();
        console.log("Clicked Continue");
        
        // Step 9: Handle warning - "I would still like to proceed"
        await browser.pause(3000);
        const proceedButton = await driver.$("accessibility id:I would still like to proceed");
        await proceedButton.waitForDisplayed({ timeout: 10000 });
        await proceedButton.click();
        console.log("Clicked 'I would still like to proceed'");
        
        // Step 10: Select "No, I know them personally"
        await browser.pause(2000);
        const knowPersonallyButton = await driver.$("accessibility id:No, I know them personally");
        await knowPersonallyButton.waitForDisplayed({ timeout: 5000 });
        await knowPersonallyButton.click();
        console.log("Selected 'No, I know them personally'");
        
        // Step 11: Proceed to add beneficiary
        await browser.pause(2000);
        const proceedToAddButton = await driver.$("accessibility id:Proceed to add beneficiary");
        await proceedToAddButton.waitForDisplayed({ timeout: 5000 });
        await proceedToAddButton.click();
        console.log("Clicked 'Proceed to add beneficiary'");
        
        // Step 12: Return to beneficiary list
        await browser.pause(5000); // Wait for beneficiary to be added
        const returnToListButton = await driver.$("accessibility id:Return to beneficiary list");
        await returnToListButton.waitForDisplayed({ timeout: 10000 });
        await returnToListButton.click();
        console.log("Returned to beneficiary list");
        
        // Step 13: Find and click on the newly created beneficiary
        await browser.pause(3000);
        const beneficiaryItem = await driver.$("-android uiautomator:new UiSelector().description(\"SO\\nSamuel Olorogu\\nGBP • 12345678 • 12-34-56\")");
        await beneficiaryItem.waitForDisplayed({ timeout: 10000 });
        await beneficiaryItem.click();
        console.log("Clicked on beneficiary item");
        
        // Step 14: Click on options menu (ImageView instance 0)
        await browser.pause(2000);
        const optionsMenu = await driver.$("-android uiautomator:new UiSelector().className(\"android.widget.ImageView\").instance(0)");
        await optionsMenu.waitForDisplayed({ timeout: 5000 });
        await optionsMenu.click();
        console.log("Clicked options menu");
        
        // Step 15: Delete beneficiary
        await browser.pause(2000);
        const deleteButton = await driver.$("accessibility id:Delete beneficiary");
        await deleteButton.waitForDisplayed({ timeout: 5000 });
        await deleteButton.click();
        console.log("Clicked 'Delete beneficiary'");
        
        // Step 16: Verify deletion (optional - you can add confirmation handling here)
        await browser.pause(3000);
        console.log("✅ Beneficiary add and delete flow completed successfully");
        
        // Save page source for verification
        try {
            const fs = require('fs');
            const path = require('path');
            const pageSource = await driver.getPageSource();
            const sourcesDir = path.join(__dirname, '../../sources');
            
            // Create sources directory if it doesn't exist
            if (!fs.existsSync(sourcesDir)) {
                fs.mkdirSync(sourcesDir, { recursive: true });
            }
            
            const sourceFile = path.join(sourcesDir, 'beneficiary_test_completion.xml');
            fs.writeFileSync(sourceFile, pageSource, 'utf8');
            console.log(`📁 Final page source saved to: ${sourceFile}`);
        } catch (error) {
            console.warn("Could not save page source:", error.message);
        }
        
        } catch (error) {
            console.error("❌ Beneficiary test failed:", error.message);
            
            // Save page source for debugging
            try {
                const fs = require('fs');
                const path = require('path');
                const pageSource = await driver.getPageSource();
                const sourcesDir = path.join(__dirname, '../../sources');
                
                if (!fs.existsSync(sourcesDir)) {
                    fs.mkdirSync(sourcesDir, { recursive: true });
                }
                
                const errorFile = path.join(sourcesDir, 'beneficiary_error.xml');
                fs.writeFileSync(errorFile, pageSource, 'utf8');
                console.log(`📁 Error page source saved to: ${errorFile}`);
            } catch (saveError) {
                console.warn("Could not save error page source:", saveError.message);
            }
            
            throw error; // Re-throw to fail the test
        }
    });
});