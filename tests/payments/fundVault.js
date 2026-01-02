const {prodUser} = require("../../config/users.js")
const { performFullLogin } = require("../../config/testUtils.js")

describe("Fund Vault Test", () => {
    it("should login and fund an existing vault successfully", async () => {
        try {
            // Perform login using existing structure
            await performFullLogin(driver, prodUser)
            console.log("Login completed successfully")
            
            // Wait for dashboard to load
            await browser.pause(5000)
            console.log("Dashboard loaded, starting vault funding process")

            // Click Save button
            const saveBtn = await driver.$("accessibility id:Save")
            await saveBtn.waitForDisplayed({ timeout: 5000 })
            await saveBtn.click()
            console.log("Clicked Save button")
            await browser.pause(2000)

            // Perform pointer action (scroll/swipe)
            await driver.action('pointer')
                .move({ duration: 0, x: 529, y: 1605 })
                .down({ button: 0 })
                .move({ duration: 1000, x: 538, y: 798 })
                .up({ button: 0 })
                .perform()
            console.log("Performed scroll/swipe action")
            await browser.pause(2000)

            // Click See all button
            const seeAllBtn = await driver.$("accessibility id:See all")
            await seeAllBtn.waitForDisplayed({ timeout: 5000 })
            await seeAllBtn.click()
            console.log("Clicked See all button")
            await browser.pause(2000)

            // Select the vault (My Vault)
            const vaultOption = await driver.$("-android uiautomator:new UiSelector().description(\"GBP\\nPending funding\\n---\\nMy Vault\")")
            await vaultOption.waitForDisplayed({ timeout: 5000 })
            await vaultOption.click()
            console.log("Selected My Vault")
            await browser.pause(2000)

            // Click Fund this account button
            const fundAccountBtn = await driver.$("accessibility id:Fund this account")
            await fundAccountBtn.waitForDisplayed({ timeout: 5000 })
            await fundAccountBtn.click()
            console.log("Clicked Fund this account button")
            await browser.pause(2000)

            // Select funding option and click twice as specified
            const fundingOption = await driver.$("-android uiautomator:new UiSelector().description(\"Add money from your balance\\nCreate an account to use this option\\nOpen a Current Account\")")
            await fundingOption.waitForDisplayed({ timeout: 5000 })
            await fundingOption.click()
            console.log("First click on funding option")
            await browser.pause(1000)
            
            await fundingOption.click()
            console.log("Second click on funding option")
            await browser.pause(3000)

            console.log("✅ Vault funding process completed successfully")
            
        } catch (error) {
            console.error("❌ Vault funding failed:", error.message)
            throw error
        }
    })
})

describe("Save Page Source for Fund Vault", () => {
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