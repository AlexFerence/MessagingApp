const users = []

const addUser = ({ id, username, room  }) => {
    //Clean the data
    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()

    if (!username || !room) {
        return {
            error: 'Username and room are required' 
        }
    }
    
    
    //Check for existing user
    const existingUser = users.find((user) => {
        return user.room === room && user.username === username
    })
    
    //Validate username
    if (existingUser) {
        return {
            error: 'Username is in use'
        }
    }

    //Store user
    const user = { id, username, room}
    users.push(user)
    return { user }

}

const removeUser = (id) => {
    const index = users.findIndex((user) => {
        return user.id === id
    }) 

    if (index !== -1) {
        return users.splice(index, 1)[0]
    }
    
}

const findUser = (id) => {
    const index = users.findIndex((user) => {
      return user.id === id  
    })
    if (index === -1) {
        return { error: 'no user exists '}
    }
    return users[index]
}

const getUsersInRoom = (room) => {
    return(users.filter((user) => user.room === room))
}


addUser({
    id: 234,
    username: 'x',
    room: 'partyRoom'
})
addUser({
    id: 34,
    username: 'ex',
    room: 'partyRoom'
})
addUser({
    id: 2543,
    username: 'lex',
    room: 'partyRoom'
})

addUser({
    id: 23,
    username: 'Alex asdf',
    room: 'partyRooasdfm'
})
addUser({
    id: 25342,
    username: 'Ale',
    room: 'partyRooasdfm'
})

//console.log(users)


//removeUser(234)
// console.log(users)
// console.log(getUsersInRoom('partyroom'))


module.exports = {
    addUser,
    removeUser,
    findUser,
    getUsersInRoom
}