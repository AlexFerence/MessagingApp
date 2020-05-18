const generateMesssage = (text, username) => {
    const m = {
        text,
        createdAt: new Date().getTime(),
        username
    }
    return(m)
}

const generateLocation = (url, username) => {
    const location = {
        url,
        createdAt: new Date().getTime(),
        username
    }
    return location
}

module.exports = {
    generateMesssage,
    generateLocation
}