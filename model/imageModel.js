import mongoose from "mongoose";

const imageSchema = mongoose.Schema(
    {
        generateBy: {
            type: mongoose.Schema.ObjectId,
            ref: 'User',
            require: true,
        },
        prompt: {
            type: String,
            require: true,
        },
        imageUrl: {
            type: String,
            require: true,
        },
        isPublic: {
            type: Boolean,
            default: false,
        },
        isAdminPublic: {
            type: Boolean,
            default: false,
        }
    },
    {
        timestamps: true,
    }
);

export const Images = mongoose.model('ImageTable', imageSchema);

