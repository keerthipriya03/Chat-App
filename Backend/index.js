const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

const chatRoutes = require("./routes/chatRoutes");
const userRoutes = require("./routes/userRoutes");
const messageRoutes = require("./routes/messageRoutes");

const { notFound, errorHandler } = require("./middleware/errorMiddleware");


dotenv.config({ quiet: true });
connectDB();

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.send("API is running!");
});

app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);

// -----deployment-----

const path = require("path");

const __dirname1 = path.resolve();

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname1, "frontend", "build")));

  app.get("/{*splat}", (req, res) => {
    res.sendFile(
      path.resolve(__dirname1, "frontend", "build", "index.html")
    );
  });
} else {
  app.get("/", (req, res) => {
    res.send("API is running");
  });
}

// -----deployment-----

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:3000",
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);

  // ✅ Setup user
  socket.on("setup", (userData) => {
    socket.join(userData._id);
    socket.userId = userData._id; // store for later
    console.log("User joined:", userData._id);
    socket.emit("connected");
  });

  // ✅ Join chat room
  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("Joined chat room:", room);
  });

  // ✅ New message
  socket.on("new message", (newMessageReceived) => {
    const chat = newMessageReceived.chat;

    if (!chat?.users) return console.log("chat.users not defined");

    chat.users.forEach((user) => {
      if (user._id === newMessageReceived.sender._id) return;

      socket.to(user._id).emit("message received", newMessageReceived);
    });
  });

  // ✅ Typing
  socket.on("typing", (room) => {
    socket.to(room).emit("typing");
  });

  socket.on("stop typing", (room) => {
    socket.to(room).emit("stop typing");
  });

  // ✅ Proper disconnect handling
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);

    if (socket.userId) {
      socket.leave(socket.userId);
    }
  });
});