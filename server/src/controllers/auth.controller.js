import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/User.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";
import { sendEmail } from "../services/emailService.js";
import crypto from "crypto";

const generateAccessAndRefreshTokens = async (userId) => {
    try {
        const user = await User.findById(userId);
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshTokens.push(refreshToken);
        await user.save({ validateBeforeSave: false });

        return { accessToken, refreshToken };
    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating the tokens");
    }
}

const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "strict"
};

const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
        throw new ApiError(400, "All fields are required");
    }

    const existedUser = await User.findOne({ email });

    if (existedUser) {
        throw new ApiError(409, "User with email already exists");
    }

    const user = await User.create({
        name,
        email,
        password,
        role: role || "volunteer"
    });

    const unhashedToken = user.createRandomToken('verificationToken');
    await user.save({ validateBeforeSave: false });

    // Send email
    const verifyUrl = `${process.env.CLIENT_URL || "http://localhost:5173"}/verify-email/${unhashedToken}`;
    const message = `<p>Please verify your email by clicking <a href="${verifyUrl}">here</a>.</p>`;
    
    try {
        await sendEmail({
            to: user.email,
            subject: "Verify your email - Sarvhit",
            html: message
        });
    } catch (error) {
        user.verificationToken = undefined;
        user.verificationTokenExpiry = undefined;
        await user.save({ validateBeforeSave: false });
        console.error(error);
    }

    const createdUser = await User.findById(user._id).select("-password -refreshTokens");

    return res.status(201).json(
        new ApiResponse(201, createdUser, "User registered successfully. Please verify your email.")
    );
});

const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        throw new ApiError(400, "email and password are required");
    }

    const user = await User.findOne({ email });

    if (!user) {
        throw new ApiError(404, "User does not exist");
    }

    const isPasswordValid = await user.isPasswordCorrect(password);

    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid user credentials");
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);

    const loggedInUser = await User.findById(user._id).select("-password -refreshTokens");

    return res
    .status(200)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .json(
        new ApiResponse(
            200, 
            { user: loggedInUser, accessToken },
            "User logged in successfully"
        )
    );
});

const logoutUser = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken;
    
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $pull: { refreshTokens: incomingRefreshToken }
        },
        { new: true }
    );

    return res
    .status(200)
    .clearCookie("refreshToken", cookieOptions)
    .json(new ApiResponse(200, {}, "User logged out"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;

    if (!incomingRefreshToken) {
        throw new ApiError(401, "Unauthorized request");
    }

    try {
        const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET || "fallback_refresh_secret");

        const user = await User.findById(decodedToken?._id);

        if (!user) {
            throw new ApiError(401, "Invalid refresh token");
        }

        if (!user.refreshTokens.includes(incomingRefreshToken)) {
            // Token reuse detected - security measure: clear all tokens
            user.refreshTokens = [];
            await user.save({ validateBeforeSave: false });
            throw new ApiError(401, "Refresh token is expired or used");
        }

        // Token rotation
        const { accessToken, refreshToken: newRefreshToken } = await generateAccessAndRefreshTokens(user._id);
        
        // Remove old and keep new
        user.refreshTokens = user.refreshTokens.filter(t => t !== incomingRefreshToken);
        await user.save({ validateBeforeSave: false });

        return res
        .status(200)
        .cookie("refreshToken", newRefreshToken, cookieOptions)
        .json(
            new ApiResponse(
                200, 
                { accessToken, refreshToken: newRefreshToken },
                "Access token refreshed"
            )
        );

    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid refresh token");
    }
});

const getCurrentUser = asyncHandler(async (req, res) => {
    return res
    .status(200)
    .json(new ApiResponse(200, req.user, "Current user fetched successfully"));
});

const verifyEmail = asyncHandler(async (req, res) => {
    const { token } = req.params;
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
        verificationToken: hashedToken,
        verificationTokenExpiry: { $gt: Date.now() }
    });

    if (!user) {
        throw new ApiError(400, "Invalid or expired verification token");
    }

    user.isEmailVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpiry = undefined;
    await user.save({ validateBeforeSave: false });

    return res.status(200).json(new ApiResponse(200, {}, "Email verified successfully"));
});

const forgotPassword = asyncHandler(async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    const unhashedToken = user.createRandomToken('resetPasswordToken');
    await user.save({ validateBeforeSave: false });

    const resetUrl = `${process.env.CLIENT_URL || "http://localhost:5173"}/reset-password/${unhashedToken}`;
    const message = `<p>Reset your password by clicking <a href="${resetUrl}">here</a>. Valid for 1 hour.</p>`;
    
    try {
        await sendEmail({
            to: user.email,
            subject: "Password Reset - Sarvhit",
            html: message
        });
        return res.status(200).json(new ApiResponse(200, {}, "Password reset email sent"));
    } catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordTokenExpiry = undefined;
        await user.save({ validateBeforeSave: false });
        throw new ApiError(500, "Email could not be sent");
    }
});

const resetPassword = asyncHandler(async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;

    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
        resetPasswordToken: hashedToken,
        resetPasswordTokenExpiry: { $gt: Date.now() }
    });

    if (!user) {
        throw new ApiError(400, "Invalid or expired reset token");
    }

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordTokenExpiry = undefined;
    await user.save(); // using standard save so pre('save') hashes it

    return res.status(200).json(new ApiResponse(200, {}, "Password reset successfully"));
});

export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    getCurrentUser,
    verifyEmail,
    forgotPassword,
    resetPassword
};
