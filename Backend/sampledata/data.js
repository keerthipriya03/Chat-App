const chats = [
    {
        isGroupChat: false,
        users:[
            {
                name:"Keerthi",
                email:"keerthi@example.com",
            },
            {
                name:"Priya",
                email:"priya@example.com",
            },
        ],
        _id: "617a1",
        chatName: "Keerthi",
    },
    {
        isGroupChat: false,
        users:[
            {
                name:"Priya",
                email:"priya@example.com",
            },
            {
                name:"Keerthi",
                email:"keerthi@example.com",
            },
            {
                name:"Keerthi Reddy",
                email:"keerthireddy@example.com",
            },
        ],
        _id: "617a2",
        chatName: "Priya",
    },
    {
        isGroupChat: true,
        users:[
            {
                name:"John",
                email:"john@example.com",
            },
            {
                name:"Jane",
                email:"jane@example.com",
            },
            {
                name: "Guest User",
                email: "guest@example.com",
            },
        ],
        _id: "617a3",
        chatName: "Group Chat",
        groupAdmin: {
            name: "Guest User",
      email: "guest@example.com",
    },
  },
];

module.exports = { chats };