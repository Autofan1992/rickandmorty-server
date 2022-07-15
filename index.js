import express from 'express'
import cors from 'cors'

import loginRoutes from './routes/login.js'
import avatarRoutes from './routes/avatar.js'

const PORT = process.env.PORT || 5000

const app = express()
app.use(cors())

app.use('/login', loginRoutes)
app.use('/avatar', avatarRoutes)



app.listen(PORT, () => {
    console.log(`server started on port ${PORT}`)
})