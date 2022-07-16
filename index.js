import express from 'express'
import cors from 'cors'
import { generateUploadUrl } from './s3.js'

import loginRoutes from './routes/login.js'
import avatarRoutes from './routes/avatar.js'

const PORT = process.env.PORT || 5000

const app = express()
app.use(cors())

app.use('/login', loginRoutes)
app.use('/avatar', avatarRoutes)

app.get('s3Url', async (req, res) => {
    const url = await generateUploadUrl()
    res.send({ url })
})

app.listen(PORT, () => {
    console.log(`server started on port ${PORT}`)
})