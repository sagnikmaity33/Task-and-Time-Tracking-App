const app=require("./index")
const connect=require("./configs/db")
const PORT = process.env.PORT || 3001
const server = app.listen(PORT, async () => {
    try {
        const actualPort = server.address().port
        console.log(`listening on port ${actualPort}`)
        return connect()
    } catch (error) {
        console.log(error)
    }
})