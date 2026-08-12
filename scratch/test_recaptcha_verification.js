require("dotenv").config();
const { verifyCaptcha } = require("../src/services/recaptcha.service");

async function runTest() {
  console.log("Testing verifyCaptcha with no token...");
  const noTokenResult = await verifyCaptcha(null);
  console.log("No token result:", noTokenResult);

  console.log("\nTesting verifyCaptcha with invalid test token...");
  const invalidTokenResult = await verifyCaptcha("invalid_test_token_12345");
  console.log("Invalid token result:", invalidTokenResult);
}

runTest();
