const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const cookie = require('cookie');
const agent = require('../agent/agent');



async function initSocketServer(httpServer) {

    const io = new Server(httpServer, {
        path: "/socket.io/",
        cors: {
            origin: "*", // Allow all origins - adjust for production
            methods: ["GET", "POST"]
        }
    })

    io.use((socket, next) => {

        const cookies = socket.handshake.headers?.cookie;

        const { token } = cookies ? cookie.parse(cookies) : {};

        if (!token) {
            return next(new Error('Token not provided'));
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            socket.user = decoded;
            socket.token = token;

            next()

        } catch (err) {
            next(new Error('Invalid token'));
        }

    })

    io.on('connection', (socket) => {

        socket.on('message', async (data) => {
            console.log(data);
            
            try {
                const agentResponse = await agent.invoke({
                    messages: [
                        {
                            role: "user",
                            content: data
                        }
                    ]
                }, {
                    metadata: {
                        token: socket.token
                    }
                })
           
                const lastMessage = agentResponse.messages[ agentResponse.messages.length - 1 ]

                socket.emit('message', lastMessage.content)
            } catch (error) {
                console.error('Error processing message:', error);
                socket.emit('error', 'Failed to process message');
            }
        })

    })

}


module.exports = { initSocketServer };