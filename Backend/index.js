const express = require('express');
const {chats} = require('./sampledata/data');
const dotenv = require('dotenv');
const connectDB = require('./config/db');



// dotenv.config();
dotenv.config({ quiet: true });

connectDB();

const app = express();


app.get('/', (req, res)=>{
    res.send('API is running!');
});

app.get('/api/chat' , (req, res)=>{
    res.send(chats);
});

app.get('/api/chat/:id', (req, res)=>{
    // console.log(req);

    // console.log(req.params.id);

    const chat = chats.find(c => c._id === req.params.id);
    if (!chat) {
        return res.status(404).send('Chat not found');
    }
    res.send(chat);
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});