# WebdriverIO based Appium Test Automation Instructions

## Author Mode Workflow


### 1. Test Case Preparation
- Fetch the test case from TestRail using the provided test case ID by
    - Using testrail mcp server to get the test case details
    - Extracting the test case name and description

### 2. Test Case to DSL and Script Generation
    - English Input to DSL
        - Analyze the user's English description of what they want to test
        - Break down the test into logical steps (DSL) (e.g., launch app, find element, interact with element) for eg :- 
        [
            {"action": "launchApp", "target": "com.example.app"},
            {"action": "waitForElement", "target": "loginButton"},
            {"action": "tap", "target": "emailField"},
            {"action": "type", "target": "emailField", "value": "test@example.com"},
            {"action": "hideKeyboard"},
            {"action": "tap", "target": "loginButton"}
        ]
        - IMPORTANT: If a step is about login then just ignore it as we aldready have handled it in the initial setup.
        - IMPORTANT: prompt user to ask if the DSL breakdown looks good to them and wait for confirmation before proceeding to script generation
    - Script Generation
        - Script Generation (Iterative, Action-by-Action)
            - For each DSL action (where an action is something that triggers a UI change, i.e., a change in page source):
                1. If no script exists, ALWAYS start with a basic launch app script as the first step.
                2. Run the script for the current action only, validate it.
                3. Use the latest page source from 'sources/page_source.xml' to determine selectors for the next dsl action you are generating the test for (describe it block).
                4. Append code for the next action (e.g., tap, type, etc.) as a new describe/it block or inside the existing block as appropriate.
                5. Repeat this process for each action, building the script incrementally, validating and updating selectors at each stage.
            - Ensure each action is validated before moving to the next.
            - IMPORTANT: Do NOT generate the full script for all actions at once. Only add code for the next UI-triggering action after validating the previous one and updating the page source.
            - Example workflow:
                - Step 1: Generate and run script for launchApp, save page source.
                - Step 2: Use new page source, generate and run script for tap action, save page source.
                - Step 3: Continue for each action, one at a time.
            - Example webdriverIo js Appium script:
                ```javascript
                describe("Test Name", () => {
                    it("should perform specific action", async () => {
                        await browser.pause(3000); // Wait for app to load
                        // Find and interact with elements
                        const element = await $('appropriate-selector');
                        await element.waitForDisplayed({ timeout: 5000 });
                        await element.click();
                        // ...
                    });
                });
                ```

### 2. Validate Script Process (retry once if it fails at max)
    - After getting the script ready (initial / updated), use the command   `npx wdio run ${configPath} --spec ${testFilePath}` keep track of the error logs to update the script if required in case of failure
    - IMPORTANT: retry at max once. ensure you do not modify the previous working steps and add/modify only the current step.
    - If still it fails exit and proceed to 3rd step (report generation).

### 3. Report Generation
    - After the process is completed generate a concise report summarizing:
        - Test Case Name
        - Steps Executed
        - Status (Pass/Fail)
        - Any errors encountered (if applicable)
    - Save the report in txt format inside `reports/` directory with a timestamped filename for easy    reference

## Test Script Structure Requirements

### Test script format (Required for all tests)

1.**Important: Script generated in `tests` file should look like the below format :-

`
const {uatUser} = require("../config/users.js")
describe("Launch Rova App", () => {
    it("should launch the Rova app, dismiss biometric popup, and wait for it to load", async () => {
        // Wait for app to load
        await browser.pause(5000)
        console.log("Rova app launched successfully.")
        // Try to dismiss biometric popup if it appears
        try {
            const usePatternBtn = await $('id=com.samsung.android.biometrics.app.setting:id/button_use_credential')
            if (await usePatternBtn.isDisplayed()) {
                await driver.back()
                console.log("Pressed back button to dismiss biometric popup.")
            }
        } catch (err) {
            console.log("Biometric popup not found or already dismissed.")
        }

        // Use credentials from config
        console.log(`Using UAT user: ${uatUser.email}`)
        // Enter MPIN using the on-screen number pad
        for (const digit of uatUser.mpin) {
            const btn = await $(`android=new UiSelector().className(\"android.widget.Button\").description(\"${digit}\")`)
            await btn.waitForDisplayed({ timeout: 3000 })
            await btn.click()
            console.log(`Clicked MPIN digit: ${digit}`)
        }
        console.log("MPIN entry complete.")

        // Wait for navigation to home screen after MPIN entry
        await browser.pause(10000)
        console.log("Waited 10 seconds for home screen navigation after MPIN entry.")
    })
}) 
${your_output_till_current_dsl_step_no}
describe("Blinkit Page Source for dsl step 'step_no'", () => {
    it("should save the page source to a file", async () => {
        try {
            const fs = require("fs")
            const pageSource = await driver.getPageSource()
            const outputPath = "./sources/page_source.xml"
            fs.writeFileSync(outputPath, pageSource, "utf8")
        } catch (error) {
            console.error("Error saving page source:",  error)
        }
    })
})`

2. **DSL steps as new describe block in test_case file**
   - Add a new describe and it block for each new DSL step

3. **Wait for Page Load**
   - Add atleast 5-second wait after navigating to ensure the page is fully loaded


## Guidelines for writing good Appium scripts:
- Use proper waiting mechanisms (waitForDisplayed, waitForExist)
- Try multiple selector strategies (accessibilityId, id, XPath) for better reliability
- Add appropriate error handling with try/catch blocks
- Include clear console logging to track test progress
- Ensure the script you provide is compatible to be used with JSON and in proper UTF-8 format


## File Organization
- Test files should be placed in the appropriate `tests/` folder
- the page source will be saved in the `sources/` folder as `page_source.xml`
