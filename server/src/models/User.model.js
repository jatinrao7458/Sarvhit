import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import crypto from "crypto";

const userSchema = new Schema(
    {
        name: {
            type: String,
            required: [true, 'Name is required'],
            trim: true,
            index: true
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
            lowercase: true,
            trim: true,
            index: true
        },
        password: {
            type: String,
            required: [true, 'Password is required']
        },
        role: {
            type: String,
            enum: ['ngo', 'volunteer', 'sponsor', 'admin'],
            default: 'volunteer'
        },
        avatar: {
            type: String, 
        },
        refreshTokens: [
            {
                type: String
            }
        ],
        isEmailVerified: {
            type: Boolean,
            default: false
        },
        verificationToken: String,
        verificationTokenExpiry: Date,
        resetPasswordToken: String,
        resetPasswordTokenExpiry: Date
    },
    {
        timestamps: true
    }
);

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password, 10);
    next();
});

userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            role: this.role
        },
        process.env.ACCESS_TOKEN_SECRET || "fallback_access_secret",
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY || "15m"
        }
    );
};

userSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        {
            _id: this._id,
        },
        process.env.REFRESH_TOKEN_SECRET || "fallback_refresh_secret",
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY || "7d"
        }
    );
};

// Generate random tokens for email verification / password reset
userSchema.methods.createRandomToken = function (tokenField) {
    const token = crypto.randomBytes(32).toString('hex');
    
    // Hash token and save it to the DB
    this[tokenField] = crypto
        .createHash('sha256')
        .update(token)
        .digest('hex');
        
    // Token valid for 24 hours (verification) or 1 hour (reset)
    const expiryField = `${tokenField}Expiry`;
    this[expiryField] = Date.now() + (tokenField === 'verificationToken' ? 24 * 60 * 60 * 1000 : 1 * 60 * 60 * 1000);
    
    return token; // Return unhashed token to send in email
};

export const User = mongoose.model("User", userSchema);
