import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocket, io } from "../lib/socket.js";
import Message from "../models/message.models.js";
import User from "../models/user.models.js";


export const getusersforSidebar = async (req, res) => {
    try {
        const loggedInUserId = req.user._id;
        const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } }).select('-password');

        res.status(200).json(filteredUsers);
    } catch (error) {
        console.log('error in getusersforSidebar', error);
        res.status(500).json({ message: 'Internal server error' });

    }
}

export const getMessages = async (req, res) => {
    try {
        const { id: usertochatId } = req.params;
        const myId = req.user._id;

        const messages = await Message.find({
            $or: [
                { senderId: myId, receiverId: usertochatId },
                { senderId: usertochatId, receiverId: myId },
            ],
        })

        res.status(200).json(messages);
    } catch (error) {
        console.log('error in getMessages', error);
        res.status(500).json({ message: 'Internal server error' });

    }
}

export const sendMessage = async (req, res) => {
    try {
        const { text, image } = req.body;
        const { id: receiverId } = req.params;
        const senderId = req.user._id;

        let imageUrl;
        if (image) {
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url;
        }

        const newMessage = new Message({
            senderId,
            receiverId,
            text,
            image: imageUrl,
        });

        await newMessage.save();
        
        //todo:realtime functionality goes here=>socket.io

        const receiverSocketId = getReceiverSocket(receiverId);
        if(receiverSocketId){
            io.to(receiverSocketId).emit('newMessage',newMessage);
        }

        res.status(200).json(newMessage);

    } catch (error) {
        console.log('error in sendMessage', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}