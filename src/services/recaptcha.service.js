const axios = require("axios");

/**
 * Verify Google reCAPTCHA token against Google's siteverify API.
 * @param {string} token - Captcha response token sent by the client.
 * @param {string} [remoteIp] - Client IP address.
 * @param {string} [secretKey] - Optional reCAPTCHA secret key (defaults to env or configured key).
 * @returns {Promise<{success: boolean, message?: string, data?: object}>}
 */
const verifyCaptcha = async (token, remoteIp = null, secretKey = null) => {
  try {
    if (!token) {
      return {
        success: false,
        message: "Captcha verification failed. Captcha token is required.",
      };
    }

    const secret =
      secretKey ||
      process.env.RECAPTCHA_SECRET_KEY ||
      "6LeMXZYtAAAAAIMoT0ve7oHo39n7twmxnwPNHxga";

    const params = new URLSearchParams();
    params.append("secret", secret);
    params.append("response", token);
    if (remoteIp) {
      params.append("remoteip", remoteIp);
    }

    const googleVerifyUrl = "https://www.google.com/recaptcha/api/siteverify";
    const response = await axios.post(googleVerifyUrl, params.toString(), {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      timeout: 10000,
    });

    const data = response.data;
    if (data && data.success) {
      return {
        success: true,
        data,
      };
    } else {
      const errorCodes =
        data && data["error-codes"] && data["error-codes"].length > 0
          ? data["error-codes"].join(", ")
          : "Invalid or expired captcha token";
      return {
        success: false,
        message: `Captcha verification failed: ${errorCodes}`,
        data,
      };
    }
  } catch (error) {
    console.error("reCAPTCHA verification error:", error.message);
    return {
      success: false,
      message: "An error occurred while verifying captcha key.",
      error: error.message,
    };
  }
};

module.exports = {
  verifyCaptcha,
};
