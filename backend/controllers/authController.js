const User = require("../models/User");
const bcrypt = require("bcryptjs");
const {
  sendVerificationEmail,
  sendResetPasswordEmail,
} = require("../utils/emailUtils");
const {
  sendSuccessResponse,
  sendErrorResponse,
} = require("../utils/serverUtils");
const {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
  getCryptoToken,
  getTokenUser,
} = require("../utils/tokenUtils");
const Worker = require("../models/Worker");
const Buyer = require("../models/Buyer");
const { verifyJWT } = require("../utils/tokenUtils");

// Register user
const register = async (req, res) => {
  try {
    const { fname, lname, email, phone, password, role } = req.body;

    if (!fname || !lname || !email || !phone || !password || !role) {
      return sendErrorResponse(res, "All fields are required.", 400);
    }

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    const existingUserPhone = await User.findOne({ phone });
    if (existingUser || existingUserPhone) {
      return sendErrorResponse(res, "User already exists.", 400);
    }

    // Create a new user
    const isFirstUser = (await User.countDocuments()) === 0; // First user should be admin
    const verificationToken = getCryptoToken();

    const user = new User({
      fname,
      lname,
      email,
      password,
      phone,
      role: isFirstUser ? "admin" : role, // Set role as 'admin' for first user, otherwise user-provided role
      verificationToken,
    });

    await user.save();

    // Create worker or buyer profile based on role
    const userId = user._id;

    if (user.role === "worker") {
      const worker = new Worker({
        _id: userId, // <=== Use same _id
        userId,
        name: `${user.fname} ${user.lname}`,
        contact: user.phone,
        experience: "",
      });
      await worker.save();
    } else if (user.role === "buyer") {
      const buyer = new Buyer({
        _id: userId, // <=== Use same _id
        userId,
        name: `${user.fname} ${user.lname}`,
        contact: user.phone,
        company: "",
        preferences: [],
      });
      await buyer.save();
    }

    await sendVerificationEmail(email, verificationToken);
    sendSuccessResponse(res, "Account created & verification email sent.");
  } catch (error) {
    sendErrorResponse(res, error.message);
  }
};

// Login user
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return sendErrorResponse(res, "Email and password are required.", 400);
    }

    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return sendErrorResponse(res, "No such user exists.", 404);
    }

    if (!existingUser.isVerified) {
      return sendErrorResponse(res, "Account not verified.", 401);
    }

    // Compare the hashed password using bcrypt
    const passwordMatch = await bcrypt.compare(password, existingUser.password);
    if (!passwordMatch) {
      return sendErrorResponse(res, "Invalid password.", 401);
    }

    const tokenUser = getTokenUser(existingUser);
    const accessToken = generateAccessToken(existingUser);
    const refreshToken = generateRefreshToken(existingUser);

    // Set refresh token in HTTP-only cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // true in production
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // Set access token in HTTP-only cookie
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // true in production
      sameSite: "strict",
      maxAge: 15 * 60 * 1000, // 15 minutes
    });

    res.status(200).json({
      success: true,
      data: tokenUser,
      message: "Logged in successfully.",
    });
  } catch (error) {
    console.log("Error: ", error);
    sendErrorResponse(res, error.message);
  }
};

// Logout user
const logout = async (req, res) => {
  try {
    // Clear both access and refresh tokens
    res.cookie("accessToken", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      expires: new Date(0),
    });

    res.cookie("refreshToken", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      expires: new Date(0),
    });

    sendSuccessResponse(res, "Logged out successfully.");
  } catch (error) {
    sendErrorResponse(res, error.message);
  }
};

// Verify email
const verifyEmail = async (req, res) => {
  try {
    const { email, verificationToken } = req.body;

    if (!email || !verificationToken) {
      return sendErrorResponse(
        res,
        "Email and verification token are required.",
        400
      );
    }

    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return sendErrorResponse(res, "No such email exists.", 404);
    }

    if (existingUser.isVerified) {
      return sendSuccessResponse(res, "Email is already verified.");
    }

    if (existingUser.verificationToken !== verificationToken) {
      return sendErrorResponse(res, "Invalid verification token.", 400);
    }

    existingUser.isVerified = true;
    existingUser.verifiedAt = new Date();
    existingUser.verificationToken = ""; // Remove token after verification
    await existingUser.save();

    sendSuccessResponse(res, "User verified successfully.");
  } catch (error) {
    sendErrorResponse(res, error.message);
  }
};

// Refresh token endpoint
const refreshToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return sendErrorResponse(res, "Refresh token not provided.", 401);
    }

    // Verify the refresh token
    const decoded = verifyRefreshToken(refreshToken);

    // Get the user
    const user = await User.findById(decoded.userId);
    if (!user) {
      return sendErrorResponse(res, "User not found.", 404);
    }

    // Generate new tokens
    const newAccessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken(user);

    // Set new refresh token
    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // Set new access token
    res.cookie("accessToken", newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 15 * 60 * 1000, // 15 minutes
    });

    res.status(200).json({
      success: true,
      message: "Tokens refreshed successfully.",
    });
  } catch (error) {
    sendErrorResponse(res, "Invalid refresh token.", 401);
  }
};

// Forgot password
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return sendErrorResponse(res, "Email is required.", 400);
    }

    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return sendSuccessResponse(
        res,
        "Reset password email sent successfully."
      );
    }

    const resetPasswordToken = getCryptoToken();
    const resetPasswordTokenExpiry = new Date(Date.now() + 1000 * 60 * 10); // 10 mins expiry

    existingUser.resetPasswordToken = resetPasswordToken;
    existingUser.resetPasswordTokenExpiry = resetPasswordTokenExpiry;
    await existingUser.save();

    await sendResetPasswordEmail(existingUser.email, resetPasswordToken);

    sendSuccessResponse(res, "Reset password email sent successfully.");
  } catch (error) {
    sendErrorResponse(res, error.message);
  }
};

// Reset password
const resetPassword = async (req, res) => {
  try {
    const { email, token, password } = req.body;

    if (!email || !token || !password) {
      return sendErrorResponse(res, "All fields are required.", 400);
    }

    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return sendErrorResponse(res, "No such user exists.", 404);
    }

    if (new Date() > existingUser.resetPasswordTokenExpiry) {
      return sendErrorResponse(
        res,
        "Reset password token expired. Please generate a new one.",
        400
      );
    }

    if (existingUser.resetPasswordToken !== token) {
      return sendErrorResponse(res, "Invalid token.", 400);
    }

    existingUser.password = password;
    existingUser.resetPasswordToken = "";
    existingUser.resetPasswordTokenExpiry = null;

    await existingUser.save();

    sendSuccessResponse(res, "Password reset successfully.");
  } catch (error) {
    sendErrorResponse(res, error.message);
  }
};

const verifyAuth = async (req, res) => {
  try {
    const accessToken = req.cookies.accessToken;
    const refreshToken = req.cookies.refreshToken;

    if (!accessToken && !refreshToken) {
      return res.status(200).json({
        success: false,
        isAuthenticated: false,
        message: "No tokens found",
      });
    }

    try {
      // Try to verify access token first
      const decoded = verifyJWT(accessToken);
      const user = await User.findById(decoded.userId);

      if (!user) {
        return res.status(200).json({
          success: false,
          isAuthenticated: false,
          message: "User not found",
        });
      }

      return res.status(200).json({
        success: true,
        isAuthenticated: true,
        data: getTokenUser(user),
      });
    } catch (error) {
      // If access token is invalid/expired, try refresh token
      if (refreshToken) {
        try {
          const decoded = verifyRefreshToken(refreshToken);
          const user = await User.findById(decoded.userId);

          if (!user) {
            return res.status(200).json({
              success: false,
              isAuthenticated: false,
              message: "User not found",
            });
          }

          // Generate new tokens
          const newAccessToken = generateAccessToken(user);
          const newRefreshToken = generateRefreshToken(user);

          // Set new tokens
          res.cookie("accessToken", newAccessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 15 * 60 * 1000, // 15 minutes
          });

          res.cookie("refreshToken", newRefreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
          });

          return res.status(200).json({
            success: true,
            isAuthenticated: true,
            data: getTokenUser(user),
          });
        } catch (refreshError) {
          return res.status(200).json({
            success: false,
            isAuthenticated: false,
            message: "Invalid refresh token",
          });
        }
      }

      return res.status(200).json({
        success: false,
        isAuthenticated: false,
        message: "Invalid access token",
      });
    }
  } catch (error) {
    sendErrorResponse(res, error.message);
  }
};

// Get token expiry information
const getTokenExpiry = async (req, res) => {
  try {
    const accessToken = req.cookies.accessToken;

    if (!accessToken) {
      return sendErrorResponse(res, "No access token found", 401);
    }

    try {
      const decoded = verifyJWT(accessToken);
      const currentTime = Math.floor(Date.now() / 1000);
      const timeUntilExpiry = decoded.exp - currentTime;

      res.status(200).json({
        success: true,
        data: {
          expiresAt: decoded.exp,
          timeUntilExpiry: timeUntilExpiry,
          expiresInMinutes: Math.floor(timeUntilExpiry / 60),
          currentTime: currentTime,
        },
      });
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        return sendErrorResponse(res, "Token has expired", 401);
      }
      return sendErrorResponse(res, "Invalid token", 401);
    }
  } catch (error) {
    sendErrorResponse(res, error.message);
  }
};

module.exports = {
  register,
  login,
  verifyEmail,
  logout,
  forgotPassword,
  resetPassword,
  verifyAuth,
  refreshToken,
  getTokenExpiry,
};
