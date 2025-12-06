import mongoose from "mongoose";

const verifyEmailSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.ObjectId,
            ref: 'UserTable',
            require: true,
        },
        token: {
            type: String,
            required: true
        },
        expireAt: {
            type: Date,
            required: true,
            default: () => new Date(Date.now() + 24 * 60 * 60 * 1000), // expires in 1 day
        }
    },
    {
        timestamps: true
    }
);

export const VerifyEmailTable = mongoose.model("verifyEmailData", verifyEmailSchema);