# Rova Mobile Automation Framework

A comprehensive WebDriverIO + Appium mobile automation framework for testing the Rova mobile application across Android and iOS platforms.

## Table of Contents

- [Overview](#overview)
- [Prerequisites](#prerequisites)
  - [Mac Prerequisites](#mac-prerequisites)
  - [Windows Prerequisites](#windows-prerequisites)
- [Installation Guide](#installation-guide)
- [Framework Setup](#framework-setup)
- [Running Tests](#running-tests)
- [Project Structure](#project-structure)
- [Configuration](#configuration)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)

## Overview

This automation framework provides:
- ✅ Cross-platform mobile testing (Android & iOS)
- ✅ WebDriverIO + Appium integration
- ✅ Comprehensive test coverage for authentication, registration, and beneficiary management
- ✅ Professional reporting with Allure
- ✅ Error handling and debugging capabilities
- ✅ CI/CD ready configurations

## Prerequisites

### Mac Prerequisites

#### 1. **System Requirements**
- macOS 10.15 (Catalina) or later
- Minimum 8GB RAM (16GB recommended)
- 50GB free disk space
- Admin privileges for installations

#### 2. **Command Line Tools**
Install Xcode Command Line Tools:
```bash
xcode-select --install
```

#### 3. **Homebrew Package Manager**
Install Homebrew for package management:
```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```
🔗 **Link:** [https://brew.sh/](https://brew.sh/)

#### 4. **Node.js and npm**
Install Node.js (version 16 or later):
```bash
brew install node
```
**Alternative:** Download from [https://nodejs.org/](https://nodejs.org/)

Verify installation:
```bash
node --version
npm --version
```

#### 5. **Java Development Kit (JDK)**
Install JDK 8 or later:
```bash
brew install openjdk@11
```
**Alternative:** Download from [https://adoptium.net/](https://adoptium.net/)

Set JAVA_HOME:
```bash
echo 'export JAVA_HOME=$(/usr/libexec/java_home)' >> ~/.zshrc
source ~/.zshrc
```

#### 6. **Android Development Environment**

**Android Studio:**
- Download: [https://developer.android.com/studio](https://developer.android.com/studio)
- Install Android Studio with default settings
- Install Android SDK Platform-Tools

**Android SDK Setup:**
1. Open Android Studio → SDK Manager
2. Install required SDK platforms (API 28+)
3. Install Android SDK Build-Tools
4. Install Android Emulator (if testing on emulator)

**Environment Variables:**
Add to `~/.zshrc`:
```bash
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/tools
export PATH=$PATH:$ANDROID_HOME/tools/bin
export PATH=$PATH:$ANDROID_HOME/platform-tools
```

#### 7. **iOS Development Environment** (Mac Only)

**Xcode:**
- Download from Mac App Store: [https://apps.apple.com/app/xcode/id497799835](https://apps.apple.com/app/xcode/id497799835)
- Install iOS Simulator
- Accept Xcode license: `sudo xcodebuild -license accept`

**iOS Deploy Tools:**
```bash
npm install -g ios-deploy
```

#### 8. **Appium**
Install Appium globally:
```bash
npm install -g appium
```

Install Appium drivers:
```bash
appium driver install uiautomator2
appium driver install xcuitest  # For iOS
```

**Appium Inspector (Optional):**
```bash
npm install -g @appium/inspector
```

#### 9. **Git Version Control**
```bash
brew install git
```

---

### Windows Prerequisites

#### 1. **System Requirements**
- Windows 10 (version 1909) or Windows 11
- Minimum 8GB RAM (16GB recommended)
- 50GB free disk space
- Administrator privileges

#### 2. **Windows Subsystem for Linux (WSL) - Optional but Recommended**
Install WSL2 for better terminal experience:
```powershell
wsl --install
```
🔗 **Guide:** [https://docs.microsoft.com/en-us/windows/wsl/install](https://docs.microsoft.com/en-us/windows/wsl/install)

#### 3. **Package Manager**
Install Chocolatey:
```powershell
Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))
```
🔗 **Link:** [https://chocolatey.org/install](https://chocolatey.org/install)

#### 4. **Node.js and npm**
Install via Chocolatey:
```powershell
choco install nodejs
```
**Alternative:** Download from [https://nodejs.org/](https://nodejs.org/)

Verify installation:
```cmd
node --version
npm --version
```

#### 5. **Java Development Kit (JDK)**
Install via Chocolatey:
```powershell
choco install openjdk11
```
**Alternative:** Download from [https://adoptium.net/](https://adoptium.net/)

Set JAVA_HOME:
1. Open System Properties → Environment Variables
2. Add new system variable:
   - Name: `JAVA_HOME`
   - Value: `C:\Program Files\Eclipse Adoptium\jdk-11.0.x.x-hotspot`

#### 6. **Android Development Environment**

**Android Studio:**
- Download: [https://developer.android.com/studio](https://developer.android.com/studio)
- Run installer with default settings
- Install Android SDK and Platform-Tools

**Environment Variables:**
Add to System Environment Variables:
```
ANDROID_HOME = C:\Users\%USERNAME%\AppData\Local\Android\Sdk
```

Add to PATH:
```
%ANDROID_HOME%\platform-tools
%ANDROID_HOME%\tools
%ANDROID_HOME%\tools\bin
%ANDROID_HOME%\emulator
```

#### 7. **Appium**
Install Appium globally:
```cmd
npm install -g appium
```

Install drivers:
```cmd
appium driver install uiautomator2
```

#### 8. **Git Version Control**
Install via Chocolatey:
```powershell
choco install git
```
**Alternative:** Download from [https://git-scm.com/download/win](https://git-scm.com/download/win)

#### 9. **Visual Studio Code (Recommended)**
```powershell
choco install vscode
```
🔗 **Link:** [https://code.visualstudio.com/](https://code.visualstudio.com/)

---

## Installation Guide

### 1. Clone the Repository
```bash
git clone https://github.com/roava/rova-mobile-automation.git
cd rova-mobile-automation
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Verify Appium Installation
```bash
appium doctor --android
# For iOS (Mac only):
appium doctor --ios
```

### 4. Configure Device/Emulator

**For Android Physical Device:**
1. Enable Developer Options
2. Enable USB Debugging
3. Connect device via USB
4. Verify connection: `adb devices`

**For Android Emulator:**
1. Create AVD in Android Studio
2. Start emulator
3. Verify: `adb devices`

**For iOS Physical Device (Mac only):**
1. Enable Developer Mode
2. Trust computer
3. Install WebDriverAgent via Xcode

**For iOS Simulator (Mac only):**
1. Open Simulator app
2. Choose device model
3. Verify device UDID: `xcrun simctl list devices`

---

## Framework Setup

### 1. Install Rova App
- Download Rova APK/IPA file
- Install on test device/emulator

### 2. Configure Test Users
Edit `config/users.js` with valid test credentials:
```javascript
module.exports = {
  prodUser: {
    email: "your-test-email@domain.com",
    passcode: "your-passcode",
    phoneNumber: "your-phone-number"
  }
};
```

### 3. Update Device Capabilities
Edit `wdio.conf.js` with your device details:
```javascript
capabilities: [{
  platformName: 'Android',
  'appium:deviceName': 'Your Device Name',
  'appium:platformVersion': '11.0',
  'appium:app': '/path/to/rova.apk'
}]
```

---

## Running Tests

### Run All Tests
```bash
npm run test
```

### Run Specific Test Suites
```bash
# Login tests
npx wdio run wdio.conf.js --spec tests/authentication/login.js

# Registration tests  
npx wdio run wdio.conf.js --spec tests/authentication/signup.js

# Beneficiary tests
npx wdio run wdio.conf.js --spec tests/beneficiary/add_delete_beneficiary.js
```

### Generate Reports
```bash
npm run allure:report:android:custom
```

---

## Project Structure

```
rova-mobile-automation/
├── config/                 # Configuration files
│   └── users.js            # Test user credentials
├── tests/                  # Test suites
│   ├── authentication/     # Login & registration tests
│   └── beneficiary/        # Beneficiary management tests
├── sources/                # Debug page sources
├── wdio.conf.js           # WebDriverIO configuration
├── package.json           # Dependencies and scripts
└── README.md              # This file
```

---

## Configuration

### WebDriverIO Configuration
Main configuration in `wdio.conf.js`:
- Device capabilities
- Test timeouts
- Reporting options
- Error handling

### User Configuration
Test credentials in `config/users.js`:
- Production user credentials
- Signup user details
- Phone numbers and verification codes

---

## Troubleshooting

### Common Issues

**1. "Cannot find Appium server"**
- Ensure Appium is installed globally: `npm install -g appium`
- Check Appium is running: `appium`

**2. "Device not found"**
- Android: Check `adb devices`
- iOS: Check device UDID and provisioning

**3. "App not installed"**
- Verify APK/IPA path in capabilities
- Check app permissions and signing

**4. "Element not found"**
- Check app version compatibility
- Review page source in `sources/` directory
- Verify selectors are correct

**5. "Java/Android SDK issues"**
- Verify JAVA_HOME and ANDROID_HOME environment variables
- Check PATH includes SDK tools

### Getting Help

1. Check test execution logs
2. Review page source dumps in `sources/` folder
3. Use Appium Inspector for element identification
4. Consult Appium documentation: [https://appium.io/docs/](https://appium.io/docs/)

---

## Device Configuration Examples

### Android Configuration
```javascript
// wdio.conf.js
capabilities: [{
  platformName: 'Android',
  'appium:deviceName': 'Android Device',
  'appium:platformVersion': '11.0',
  'appium:automationName': 'UiAutomator2',
  'appium:app': './apk/rova-app.apk',
  'appium:appPackage': 'com.roava.app',
  'appium:appActivity': '.MainActivity'
}]
```

### iOS Configuration
```javascript
// wdio.ios.conf.js
capabilities: [{
  platformName: 'iOS',
  'appium:deviceName': 'iPhone 13',
  'appium:platformVersion': '15.0',
  'appium:automationName': 'XCUITest',
  'appium:app': './ios/RovaApp.app',
  'appium:bundleId': 'com.roava.app'
}]
```

---

## Useful Commands

### Appium Commands
```bash
# Start Appium server
appium

# Check Appium doctor
appium doctor

# List installed drivers
appium driver list

# Install specific driver
appium driver install uiautomator2
```

### Android Commands
```bash
# List connected devices
adb devices

# Install APK
adb install app.apk

# View device logs
adb logcat

# Start app
adb shell am start -n com.roava.app/.MainActivity
```

### iOS Commands (Mac only)
```bash
# List simulators
xcrun simctl list devices

# Boot simulator
xcrun simctl boot "iPhone 13"

# Install app on simulator
xcrun simctl install booted path/to/app.app
```

---

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

---

## Support

For technical support or questions:
- Create an issue on GitHub
- Check existing documentation
- Review Appium and WebDriverIO official docs

---

## Additional Resources

### Official Documentation
- **WebDriverIO:** [https://webdriver.io/](https://webdriver.io/)
- **Appium:** [https://appium.io/](https://appium.io/)
- **Android Developer:** [https://developer.android.com/](https://developer.android.com/)
- **iOS Developer:** [https://developer.apple.com/](https://developer.apple.com/)

### Useful Tools
- **Appium Inspector:** [https://github.com/appium/appium-inspector](https://github.com/appium/appium-inspector)
- **Android Studio:** [https://developer.android.com/studio](https://developer.android.com/studio)
- **Xcode:** [https://developer.apple.com/xcode/](https://developer.apple.com/xcode/)

---

**Happy Testing!** 🚀