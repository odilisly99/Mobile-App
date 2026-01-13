const {prodUser} = require("../../config/users.js");
const { autoAcceptPermissions, hideKeyboardIfVisible, savePageSourceForDebug, performFullLogin } = require("../../config/testUtils.js");

describe("Beneficiary Management", () => {
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

    it("should add and delete a beneficiary", async () => {
        try {
        // Step 1: Login
        await performFullLogin(driver, prodUser);
        
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
        const addOwnAccount = await driver.$("-android uiautomator:new UiSelector().className(\"android.widget.ImageView\").descriptionContains(\"Add your own account\")");
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
        const beneficiaryItem = await driver.$("-android uiautomator:new UiSelector().descriptionContains(\"Samuel Olorogu\").descriptionContains(\"12345678\")");
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
        
        // Step 16: Verify return to beneficiary list is displayed
        await browser.pause(3000);
        const returnToBeneficiaryListButton = await driver.$("accessibility id:Return to beneficiaries list");
        await returnToBeneficiaryListButton.waitForDisplayed({ timeout: 10000 });
        console.log("✅ Verified 'Return to beneficiaries list' is displayed");
        
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
            
            await savePageSourceForDebug(driver, "beneficiary_test_completion");
        } catch (error) {
            console.warn("Could not save page source:", error.message);
        }
        
        } catch (error) {
            console.error("❌ Beneficiary test failed:", error.message);
            await savePageSourceForDebug(driver, "beneficiary_error");
            throw error; // Re-throw to fail the test
        }
    });
});