// users-external.js - Dynamic user data from external sources
const fs = require('fs');
const path = require('path');

class DynamicUserManager {
  constructor() {
    this.cache = new Map();
    this.cacheTimeout = 5 * 60 * 1000; // 5 minutes cache
  }

  // Load from environment variables
  getFromEnv() {
    return {
      prodUser: {
        email: process.env.PROD_USER_EMAIL || "remit002@yopmail.com",
        passcode: process.env.PROD_USER_PASSCODE || "123333",
        phoneNumber: process.env.PROD_USER_PHONE || "6546549870",
        otp: process.env.PROD_USER_OTP || "654321",
        dob: process.env.PROD_USER_DOB || "05-11-2000",
        pin: process.env.PROD_USER_PIN || "2580"
      },
      signupUser: {
        emailBase: process.env.SIGNUP_USER_EMAIL_BASE || "bashir.alatishe",
        emailDomain: process.env.SIGNUP_USER_EMAIL_DOMAIN || "@getrova.com",
        bvn: process.env.SIGNUP_USER_BVN || "22146953305",
        phoneNumber: process.env.SIGNUP_USER_PHONE || "08109065446",
        otp: process.env.SIGNUP_USER_OTP || "654321",
        state: process.env.SIGNUP_USER_STATE || "FCT (Abuja)",
        lga: process.env.SIGNUP_USER_LGA || "Abaji",
        streetAddress: process.env.SIGNUP_USER_ADDRESS || "14 Abaji Street",
        landmark: process.env.SIGNUP_USER_LANDMARK || "Near Central Market",
        city: process.env.SIGNUP_USER_CITY || "Abaji",
        passcode: process.env.SIGNUP_USER_PASSCODE || "123456"
      }
    };
  }

  // Load from external JSON file
  getFromFile(filePath = './config/external-users.json') {
    try {
      const fullPath = path.resolve(filePath);
      if (fs.existsSync(fullPath)) {
        const data = fs.readFileSync(fullPath, 'utf8');
        return JSON.parse(data);
      }
    } catch (error) {
      console.warn(`Warning: Could not load external users from ${filePath}:`, error.message);
    }
    return null;
  }

  // Load from remote API (mock example)
  async getFromAPI(apiUrl = process.env.TEST_USERS_API_URL) {
    if (!apiUrl) return null;
    
    const cacheKey = `api_${apiUrl}`;
    const cached = this.cache.get(cacheKey);
    
    if (cached && (Date.now() - cached.timestamp < this.cacheTimeout)) {
      return cached.data;
    }

    try {
      // Mock API call - replace with actual implementation
      const response = await fetch(apiUrl, {
        headers: {
          'Authorization': `Bearer ${process.env.API_TOKEN || ''}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Cache the result
      this.cache.set(cacheKey, {
        data,
        timestamp: Date.now()
      });
      
      return data;
    } catch (error) {
      console.warn('Warning: Could not load users from API:', error.message);
      return null;
    }
  }

  // Generate unique test user data
  generateUniqueUser(baseUser, type = 'test') {
    const timestamp = Date.now();
    const randomSuffix = Math.random().toString(36).substring(2, 8);
    
    return {
      ...baseUser,
      email: baseUser.email.replace('@', `+${type}${timestamp}${randomSuffix}@`),
      phoneNumber: this.generateUniquePhoneNumber(baseUser.phoneNumber),
      _generatedAt: new Date().toISOString(),
      _type: type
    };
  }

  generateUniquePhoneNumber(basePhone) {
    const prefix = basePhone.substring(0, 6);
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    return prefix + randomSuffix;
  }

  // Main method to get users with fallback strategy
  async getUsers() {
    // Try multiple sources in order of preference
    const sources = [
      () => this.getFromAPI(),
      () => this.getFromFile(),
      () => this.getFromEnv()
    ];

    for (const source of sources) {
      try {
        const users = await source();
        if (users) {
          console.log(`✓ Loaded test users from: ${source.name || 'source'}`);
          return users;
        }
      } catch (error) {
        console.warn(`Failed to load from source:`, error.message);
      }
    }

    // Fallback to static data
    console.log('⚠ Falling back to static user data');
    return {
      prodUser: {
        email: "remit002@yopmail.com",
        passcode: "123333",
        phoneNumber: "6546549870",
        otp: "654321",
        dob: "05-11-2000",
        pin: "2580"
      },
      signupUser: {
        emailBase: "bashir.alatishe",
        emailDomain: "@getrova.com",
        bvn: "22146953305",
        phoneNumber: "08109065446",
        otp: "654321",
        state: "FCT (Abuja)",
        lga: "Abaji",
        streetAddress: "14 Abaji Street",
        landmark: "Near Central Market",
        city: "Abaji",
        passcode: "123456"
      }
    };
  }
}

const userManager = new DynamicUserManager();

// Export async function to get dynamic users
module.exports = {
  getUsers: () => userManager.getUsers(),
  generateUniqueUser: (baseUser, type) => userManager.generateUniqueUser(baseUser, type),
  
  // Backwards compatibility - lazy loading
  get prodUser() {
    throw new Error('Please use: const {prodUser} = await require("./users-external").getUsers()');
  },
  get signupUser() {
    throw new Error('Please use: const {signupUser} = await require("./users-external").getUsers()');
  }
};
