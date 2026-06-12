const mongoose = require('mongoose');

// name
// email
// password
const userSchema = mongoose.Schema(
    {
        name: { type: String, trim: true,required: true },
        email: { type: String, trim: true, unique: true ,required: true},
        password: { type: String, trim: true,required: true },
        pic: {
            type: "String",
            required: true,
            default:
                "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
            },
            isAdmin: {
            type: Boolean,
            required: true,
            default: false,
            },
    },
    { timestamps: true }
);

const User = mongoose.model("User", userSchema);
module.exports = User;