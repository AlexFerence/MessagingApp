const http = require('http')
const path = require('path')
const express = require('express')
const socketio = require('socket.io')
const Filter = require('bad-words')
const { generateMesssage, generateLocation } = require('./utils/messages')
const { addUser, removeUser, findUser, getUsersInRoom } = require('../src/utils/users')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

const port = process.env.PORT || 3000
const staticpath = path.join(__dirname, '../public')

app.use(express.static(staticpath))

//io

io.on('connection', (socket) => {
    console.log('new web socket connection')


    socket.on('join', ({ username, room }, callback) => {

        const {error, user} = addUser({ id: socket.id, username, room })

        if (error) {
            return callback(error)
        }
        
        socket.join(user.room)

        socket.emit('message', generateMesssage('Welcome'))
        socket.broadcast.to(user.room).emit('message', generateMesssage(`${user.username} has joined!`))

        io.to(user.room).emit('roomData', {
            room: user.room,
            users: getUsersInRoom(user.room)
        })

        callback()
    })


    socket.on('sendMessage', (message, callback) => {

        const user = findUser(socket.id)

        const filter = new Filter()
        
        if (filter.isProfane(message)) {
            return(callback('Profanity is not allowed'))
        }

        io.to(user.room).emit('message', generateMesssage(message, user.username))
        callback()
    })


    socket.on('sendLocation', (position, cb) => {
        const user = findUser(socket.id)
        const url = `https://google.com/maps?q=${position.latitude},${position.longitude}`
        io.to(user.room).emit('location', generateLocation(url, user.username))
        cb()
    }) 


    socket.on('disconnect', () => {
        const user = removeUser(socket.id)
        // const user = findUser(socket.id)
        if (user) {
            io.to(user.room).emit('message', generateMesssage(`${user.username} has left`))

            io.to(user.room).emit('roomData', {
                room: user.room,
                users: getUsersInRoom(user.room)
            })
        }
     
    })
})

//listening


server.listen(port, () => {
    console.log('Listening on port ' + port)
})
