const {prodUser, signupUser} = require("../../config/users.js");

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

describe("User Registration", () => {
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

    it("should complete the sign up process", async () => {
        try {
        await autoAcceptPermissions(driver);
        
        // Generate random digits for unique email
        const randomDigits = Math.floor(Math.random() * 10000);
        const testEmail = `${signupUser.emailBase}+${randomDigits}${signupUser.emailDomain}`;
        const continueButton1 = await driver.$("accessibility id:Continue");
        console.log(`Using test email: ${testEmail}`);

        // Step 1: Click Get started
        console.log("Step 1: Clicking Get started...");
        const getStartedButton = await driver.$("accessibility id:Get started");
        await getStartedButton.waitForDisplayed({ timeout: 10000 });
        await getStartedButton.click();
        console.log("✅ Clicked Get started");
        
        // Step 2: Click Sign up
        console.log("Step 2: Clicking Sign up...");
        await browser.pause(2000);
        const signUpButton = await driver.$("accessibility id:Sign up");
        await signUpButton.waitForDisplayed({ timeout: 10000 });
        await signUpButton.click();
        console.log("✅ Clicked Sign up");
        
        // Step 2a: Allow notifications
        console.log("Step 2a: Allowing notifications...");
        await browser.pause(2000);
        const allowNotificationsButton = await driver.$("accessibility id:Allow notifications");
        await allowNotificationsButton.waitForDisplayed({ timeout: 5000 });
        await allowNotificationsButton.click();
        console.log("✅ Clicked Allow notifications");

        // Auto accept permissions after clicking Get started
        console.log("Auto-accepting permissions after Get started...");
        await autoAcceptPermissions(driver);
        
        // Step 3: Select country of residence dropdown
        console.log("Step 3: Opening country dropdown...");
        await browser.pause(2000);
        const countryDropdown = await driver.$("-android uiautomator:new UiSelector().resourceId(\"countryOfResidenceDropdown\")");
        await countryDropdown.waitForDisplayed({ timeout: 5000 });
        await countryDropdown.click();
        console.log("✅ Opened country dropdown");
        
        // Step 4: Select Nigeria
        console.log("Step 4: Selecting Nigeria...");
        await browser.pause(1000);
        const nigeriaOption = await driver.$("accessibility id:Nigeria");
        await nigeriaOption.waitForDisplayed({ timeout: 5000 });
        await nigeriaOption.click();
        console.log("✅ Selected Nigeria");
        
        // Step 5: Click continue for country selection
        console.log("Step 5: Continuing from country selection...");
        await browser.pause(1000);
        const countryContinueButton = await driver.$("-android uiautomator:new UiSelector().resourceId(\"countryOfResidenceContinueButton\")");
        await countryContinueButton.waitForDisplayed({ timeout: 5000 });
        await countryContinueButton.click();
        console.log("✅ Clicked country continue button");
        
        // Step 6: Enter email address
        console.log("Step 6: Entering email address...");
        await browser.pause(2000);
        const emailField = await driver.$("-android uiautomator:new UiSelector().resourceId(\"emailCaptureField\")");
        await emailField.waitForDisplayed({ timeout: 5000 });
        await emailField.click();
        await emailField.addValue(testEmail);
        const checkBox = await driver.$("class name:android.widget.ImageView");
        await checkBox.click();
        await continueButton1.click();
        console.log(`✅ Entered email: ${testEmail}`);
        
        // Step 6a: Enter email OTP
        console.log("Step 6a: Entering email OTP...");
        await browser.pause(2000);
        const emailOtpField = await driver.$("-android uiautomator:new UiSelector().resourceId(\"otpVerificationPinInput\")");
        await emailOtpField.waitForDisplayed({ timeout: 5000 });
        await emailOtpField.click();
        await emailOtpField.addValue(signupUser.otp);
        console.log(`✅ Entered email OTP: ${signupUser.otp}`);
        
        // Step 7: Click ImageView (possibly email validation or next step)
        console.log("Step 7: Inputting BVN");
        await browser.pause(1000);
        const bvn = await driver.$("-android uiautomator:new UiSelector().resourceId(\"bvnInputField\")");
        await bvn.waitForDisplayed({ timeout: 5000 });
        await bvn.click();
        await bvn.addValue(signupUser.bvn);
        console.log("✅ Entered BVN");
        
        // Step 8: Click Continue
        console.log("Step 8: Clicking Continue...");
        await browser.pause(2000);
        const continueBVNButton = await driver.$("-android uiautomator:new UiSelector().resourceId(\"bvnContinueButton\")");
        await continueBVNButton.waitForDisplayed({ timeout: 5000 });
        await continueBVNButton.click();
        console.log("✅ Clicked Continue");
        
        // Step 9: Enter phone number (second EditText field)
        console.log("Step 9: Entering phone number...");
        await browser.pause(1000);
        const bvnVerify = await driver.$("-android uiautomator:new UiSelector().resourceId(\"otpVerificationPinInput\")");
        await bvnVerify.click();
        await bvnVerify.addValue(signupUser.otp);
        await hideKeyboardIfVisible(driver);
        console.log(`✅ Entered phone number: ${signupUser.otp}`);
        
        // Step 11: Click continue button
        console.log("Step 11: Clicking continue button...");
        await browser.pause(2000);
        await continueButton1.waitForDisplayed({ timeout: 5000 });
        await continueButton1.click();
        console.log("✅ Clicked continue button");
        
        // Step 12: Select state 
        console.log("Step 12: Opening state dropdown...");
        await browser.pause(2000);
        const stateDropdown = await driver.$("-android uiautomator:new UiSelector().className(\"android.view.View\").instance(9)");
        await stateDropdown.waitForDisplayed({ timeout: 5000 });
        await stateDropdown.click();
        console.log("✅ Opened state dropdown");
        
        // Step 13: Select state
        console.log(`Step 13: Selecting Abuja...`);
        await browser.pause(1000);
        const fctOption = await driver.$("-android uiautomator:new UiSelector().description(\"FCT (Abuja)\")");
        await fctOption.waitForDisplayed({ timeout: 5000 });
        await fctOption.click();
        console.log(`✅ Selected Abuja`);

        // Step 14: Select LGA
        console.log("Step 14: Opening LGA dropdown...");
        await browser.pause(2000);
        const lgaDropdown = await driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(0)");
        await lgaDropdown.waitForDisplayed({ timeout: 5000 });
        await lgaDropdown.click();
        console.log("✅ Opened LGA dropdown");
        
        // Step 15: Select LGA
        console.log(`Step 15: Selecting Abaji...`);
        await browser.pause(1000);
        const lgaOption = await driver.$("-android uiautomator:new UiSelector().description(\"Abaji\")");
        await lgaOption.waitForDisplayed({ timeout: 5000 });
        await lgaOption.click();
        console.log(`✅ Selected Abaji`);
        
        // Step 16: Input Address
        console.log("Step 16: Address");
        await browser.pause(2000);
        const address = await driver.$("-android uiautomator:new UiSelector().resourceId(\"addressHouseAddressField\")");
        await address.waitForDisplayed({ timeout: 5000 });
        await address.click();
        await address.addValue(signupUser.streetAddress);
        console.log("✅ Entered address");

        // Step 17: Enter street landmark
        console.log("Step 17: Entering street landmark...");
        await browser.pause(2000);
        const landmark = await driver.$("-android uiautomator:new UiSelector().resourceId(\"addressLandmarkField\")");
        await landmark.waitForDisplayed({ timeout: 5000 });
        await landmark.click();
        await landmark.addValue(signupUser.landmark);
        console.log(`✅ Entered street landmark: ${signupUser.landmark}`);
        
        // Step 18: Click Continue for address
        console.log("Step 18: Clicking Continue for address...");
        await browser.pause(1000);
        const continueButton4 = await driver.$("accessibility id:Continue");
        await continueButton4.waitForDisplayed({ timeout: 5000 });
        await continueButton4.click();
        console.log("✅ Clicked Continue for address");
        
        // Step 19: Confirm address looks good
        console.log("Step 19: Confirming address...");
        await browser.pause(3000);
        const confirmButton = await driver.$("accessibility id:Ok, looks good");
        await confirmButton.waitForDisplayed({ timeout: 5000 });
        await confirmButton.click();
        console.log("✅ Confirmed address looks good");
        
        // Step 20: Enter passcode (first time)
        console.log("Step 20: Entering passcode (first time)...");
        await browser.pause(2000);
        const passcodeField1 = await driver.$("-android uiautomator:new UiSelector().resourceId(\"passwordCaptureField\")");
        await passcodeField1.waitForDisplayed({ timeout: 5000 });
        await passcodeField1.click();
        await passcodeField1.addValue(signupUser.passcode);
        console.log("✅ Entered passcode first time");
        
        // Step 21: Enter passcode (confirmation)
        console.log("Step 21: Confirming passcode...");
        await browser.pause(2000);
        const passcodeField2 = await driver.$("-android uiautomator:new UiSelector().resourceId(\"passwordCaptureField\")");
        await passcodeField2.waitForDisplayed({ timeout: 5000 });
        await passcodeField2.click();
        await passcodeField2.addValue(signupUser.passcode);
        await hideKeyboardIfVisible(driver);
        console.log("✅ Confirmed passcode");
        
        // Step 22: Verify "Go to Dashboard" element is displayed
        console.log("Step 22: Verifying 'Go to Dashboard' element is displayed...");
        await browser.pause(3000);
        const goToDashboard = await driver.$("-android uiautomator:new UiSelector().description(\"Go to Dashboard\")");
        await goToDashboard.waitForDisplayed({ timeout: 10000 });
        
        if (await goToDashboard.isDisplayed()) {
            console.log("✅ 'Go to Dashboard' element is displayed - signup flow completed successfully!");
        } else {
            throw new Error("❌ 'Go to Dashboard' element is not displayed after signup completion");
        }
        
        await browser.pause(5000);
        console.log("🎉 Sign up process completed successfully!");
        
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
            
            const sourceFile = path.join(sourcesDir, 'signup_completion.xml');
            fs.writeFileSync(sourceFile, pageSource, 'utf8');
            console.log(`📁 Final page source saved to: ${sourceFile}`);
        } catch (error) {
            console.warn("Could not save page source:", error.message);
        }
        
        } catch (error) {
            console.error("❌ Signup test failed:", error.message);
            
            // Save page source for debugging
            try {
                const fs = require('fs');
                const path = require('path');
                const pageSource = await driver.getPageSource();
                const sourcesDir = path.join(__dirname, '../../sources');
                
                if (!fs.existsSync(sourcesDir)) {
                    fs.mkdirSync(sourcesDir, { recursive: true });
                }
                
                const errorFile = path.join(sourcesDir, 'signup_error.xml');
                fs.writeFileSync(errorFile, pageSource, 'utf8');
                console.log(`📁 Error page source saved to: ${errorFile}`);
            } catch (saveError) {
                console.warn("Could not save error page source:", saveError.message);
            }
            
            throw error; // Re-throw to fail the test
        }
    });
});