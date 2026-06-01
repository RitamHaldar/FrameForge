import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    avatar: {
        type: String,
        default: "https://ik.imagekit.io/9yt9khgb0/istockphoto-1451587807-612x612.jpg"
    },
    password: {
        type: String,
        required: function () { return this.googleId ? false : true },
        default: ""
    },
    googleId: {
        type: String,
        required: function () { return this.password ? false : true },
        default: ""
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    otp: {
        type: String,
    }

})

userSchema.pre("save", async function () {
    if (!this.password || !this.isModified("password")) {
        return;
    }
    this.password = await bcrypt.hash(this.password, 10);
})

userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
}

const User = mongoose.model("User", userSchema);
export default User;