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
        credits:{
            type: Number,
            default: 5,
        }
    },
    {
        timestamps: true,
    }
)

export const User = mongoose.model('UserTable', userSchema);


