const {prodUser} = require("../../config/users.js")
const { performFullLogin } = require("../../config/testUtils.js")

describe("Vault Creation Test", () => {
    it("should login and create a new vault successfully", async () => {
        try {
            // Perform login using existing structure
            await performFullLogin(driver, prodUser)
            console.log("Login completed successfully")
            
            // Wait for dashboard to load
            await browser.pause(5000)
            console.log("Dashboard loaded, starting vault creation")

            // Click Save button
            const saveBtn = await driver.$("accessibility id:Save")
            await saveBtn.waitForDisplayed({ timeout: 5000 })
            await saveBtn.click()
            console.log("Clicked Save button")
            await browser.pause(2000)

            // Enter amount
            const amountField = await driver.$("class name:android.widget.EditText")
            await amountField.waitForDisplayed({ timeout: 5000 })
            await amountField.click()
            await amountField.addValue("100000")
            console.log("Entered amount: 100000")
            await browser.pause(2000)

            // Select interest rate and duration
            const interestOption = await driver.$("-android uiautomator:new UiSelector().description(\"7.0% AER\\n1 Month\")")
            await interestOption.waitForDisplayed({ timeout: 5000 })
            await interestOption.click()
            console.log("Selected 7.0% AER 1 Month option")
            await browser.pause(2000)

            // Start saving
            const startSavingBtn = await driver.$("accessibility id:Start saving")
            await startSavingBtn.waitForDisplayed({ timeout: 5000 })
            await startSavingBtn.click()
            console.log("Clicked Start saving button")
            await browser.pause(3000)

            // Select Holiday fund
            const holidayFundOption = await driver.$("-android uiautomator:new UiSelector().description(\"Holiday fund 🌴\\nSave for your next getaway\")")
            await holidayFundOption.waitForDisplayed({ timeout: 5000 })
            await holidayFundOption.click()
            console.log("Selected Holiday fund option")
            await browser.pause(2000)

            // Continue after selecting fund type
            const continueBtn1 = await driver.$("accessibility id:Continue")
            await continueBtn1.waitForDisplayed({ timeout: 5000 })
            await continueBtn1.click()
            console.log("Clicked Continue after fund selection")
            await browser.pause(2000)

            // Enter vault name
            const vaultNameField = await driver.$("class name:android.widget.EditText")
            await vaultNameField.waitForDisplayed({ timeout: 5000 })
            await vaultNameField.click()
            await vaultNameField.addValue("My Vault")
            console.log("Entered vault name: My Vault")
            await browser.pause(2000)

            // Continue after entering name
            const continueBtn2 = await driver.$("accessibility id:Continue")
            await continueBtn2.waitForDisplayed({ timeout: 5000 })
            await continueBtn2.click()
            console.log("Clicked Continue after entering vault name")
            await browser.pause(2000)

            // Keep same details
            const keepDetailsBtn = await driver.$("accessibility id:No, my details remain the same")
            await keepDetailsBtn.waitForDisplayed({ timeout: 5000 })
            await keepDetailsBtn.click()
            console.log("Selected to keep same details")
            await browser.pause(2000)

            // Select Salary as income source
            const salaryOption = await driver.$("-android uiautomator:new UiSelector().description(\"Salary\\nRegular income or bonuses from your workplace\")")
            await salaryOption.waitForDisplayed({ timeout: 5000 })
            await salaryOption.click()
            console.log("Selected Salary as income source")
            await browser.pause(2000)

            // Continue after income source
            const continueBtn3 = await driver.$("accessibility id:Continue")
            await continueBtn3.waitForDisplayed({ timeout: 5000 })
            await continueBtn3.click()
            console.log("Clicked Continue after income source")
            await browser.pause(2000)

            // Continue through next steps
            const continueBtn4 = await driver.$("accessibility id:Continue")
            await continueBtn4.waitForDisplayed({ timeout: 5000 })
            await continueBtn4.click()
            console.log("Clicked Continue (step 4)")
            await browser.pause(2000)

            const continueBtn5 = await driver.$("accessibility id:Continue")
            await continueBtn5.waitForDisplayed({ timeout: 5000 })
            await continueBtn5.click()
            console.log("Clicked Continue (step 5)")
            await browser.pause(2000)

            // Agree to terms
            const agreeTermsBtn = await driver.$("accessibility id:I have read, understood, and agree to the account terms ,FSCS protection, and summary box.")
            await agreeTermsBtn.waitForDisplayed({ timeout: 5000 })
            await agreeTermsBtn.click()
            console.log("Agreed to terms and conditions")
            await browser.pause(2000)

            // Create Vault
            const createVaultBtn = await driver.$("accessibility id:Create Vault")
            await createVaultBtn.waitForDisplayed({ timeout: 5000 })
            await createVaultBtn.click()
            console.log("Clicked Create Vault button")
            await browser.pause(5000)

            // Verify vault creation success by checking if Return to home button is displayed
            const returnHomeBtn = await driver.$("accessibility id:Return to home")
            await returnHomeBtn.waitForDisplayed({ timeout: 5000 })
            
            if (await returnHomeBtn.isDisplayed()) {
                console.log("✅ Vault creation completed successfully - Return to home button is displayed")
            } else {
                throw new Error("Return to home button not displayed - vault creation may have failed")
            }
            
        } catch (error) {
            console.error("❌ Vault creation failed:", error.message)
            throw error
        }
    })
})

describe("Save Page Source for Vault Creation", () => {
    it("should save the page source to a file", async () => {
        try {
            const fs = require("fs")
            const pageSource = await driver.getPageSource()
            const outputPath = "./sources/page_source.xml"
            fs.writeFileSync(outputPath, pageSource, "utf8")
            console.log("Page source saved successfully")
        } catch (error) {
            console.error("Error saving page source:", error)
        }
    })
})