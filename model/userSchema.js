import mongoose from 'mongoose';

const userSchema = mongoose.Schema(
    {
        name: {
            type: String,
            require: true,
        },
        email: {
            type: String,
            require: true,
            unique: true,
            lowercase: true,
        },
        password: {
            type: String,
            require: true,
        },
        isVerified: {
            type: Boolean,
            default: false,
            require: true,
        },
        credits: {
            type: Number,
            default: 5,
        },
        genImagesCount: {
            type: Number,
            default: 0,
        },
        processImg: {
            type: Boolean,
            default: false,
        }
    },
    {
        timestamps: true,
    }
)

export const User = mongoose.model('UserTable', userSchema);


