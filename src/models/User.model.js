import mongoose from "mongoose";
import Counter from "./Counter.model.js";

const userSchema = new mongoose.Schema({
    user_id: { type: Number, unique: true },
    user_name: { type: String, required: true },
    age: { type: Number, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

userSchema.pre('save', async function () {

    if (!this.isNew) {
        return;
    }

    try {
        const counter = await Counter.findOneAndUpdate(
            {},
            { $inc: { seq: 1 } },
            { new: true, upsert: true }
        );
        this.user_id = counter.seq;
    } catch (error) {
        return error;
    }
});

const User = mongoose.model("User", userSchema);

export default User;