const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

async function testGemini() {
  console.log("Testing Gemini API...");
  
  const apiKey = process.env.VITE_GEMINI_API_KEY;
  console.log("API Key found:", apiKey ? "Yes" : "No");
  console.log("API Key preview:", apiKey ? apiKey.substring(0, 10) + "..." : "None");
  
  if (!apiKey) {
    console.error("❌ No API key found in environment variables");
    return;
  }
  
  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    
    // Test different models to see which ones work
    const modelsToTest = [
      "gemini-2.5-flash",
      "gemini-2.5-flash-lite", 
      "gemini-2.5-pro",
      "gemini-pro",
      "gemini-1.5-flash"
    ];
    
    for (const modelName of modelsToTest) {
      console.log(`\n🧪 Testing model: ${modelName}`);
      try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent("Say hello");
        const response = await result.response;
        const text = response.text();
        console.log(`✅ ${modelName} works! Response: ${text.substring(0, 50)}...`);
        break; // Stop at first working model
      } catch (error) {
        console.log(`❌ ${modelName} failed: ${error.message}`);
      }
    }
    
  } catch (error) {
    console.error("❌ General error:", error.message);
  }
}

testGemini();