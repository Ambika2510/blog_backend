const User = require("../models/usermodel");
const Post = require('../models/postmodel');
const mongoose = require("mongoose");
//get a singleuser
const getSingleUser = async(req, res) => {
    const { id } = req.params;
    try {
        const { id } = req.params;
        const user = await User.findById(id);
        res.status(200).json(user);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};
//get user friends
const getUserFriends = async(req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);
        const friends = await Promise.all(user.friends.map((id) => User.findById(id)));
        const formattedfriends = friends.map(
            ({ _id, firstname, lastname, occupation, picturePath }) => {
                return { _id, firstname, lastname, occupation, picturePath };
            }
        );

        res.status(200).json(formattedfriends);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};
//update add or remove friend
const updateAddOrRemoveFriend = async(req, res) => {
    try {
        const { id, friendid } = req.params;
        const user = await User.findById(id);
        const friend = await User.findById(friendid);
        if (user.friends.includes(friendid)) {
            user.friends = user.friends.filter((x) => (x !== friendid));
            friend.friends = friend.friends.filter((x) => (x !== id));
        } else {
            user.friends.push(friendid);
            friend.friends.push(id);
        }
        await user.save();
        await friend.save();
        const friends = await Promise.all(user.friends.map((id) => User.findById(id)));
        const formattedfriends = friends.map(
            ({ _id, firstname, lastname, occupation, picturePath }) => {
                return { _id, firstname, lastname, occupation, picturePath };
            }
        );
        res.status(200).json(formattedfriends);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }

};
//search user
const searchUser = async(req, res) => {
        try {
            const { searchuser } = req.params;
            const data = searchuser.split(" ");
            const x1 = data[0];
            const user = await User.find({
                firstname: { $regex: x1, $options: "i" }
            })

            if (user.length > 0 || data.length === 1) {
                res.status(200).json(user);
            } else if (data.length > 1) {
                const x2 = data[1];
                const user2 = await User.find({ lastname: { $regex: x2, $options: "i" } });

                res.status(200).json(user2);
            }
        } catch (error) {

            res.status(404).json({ message: error.message });
        }
    }
    //user profile update
const updateProfile = async(req, res) => {
    try {
        const { id } = req.params;
        const { url } = req.body;
        const user = await User.findByIdAndUpdate(id, { picturePath: url }, {
            new: true
        });
        const post = await Post.updateMany({
            userid: id
        }, {
            $set: {
                userPicturePath: url
            }
        });
        res.status(200).json(user);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}
module.exports = { getSingleUser, getUserFriends, updateAddOrRemoveFriend, searchUser, updateProfile };