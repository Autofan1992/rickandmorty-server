require('dotenv').config()
const express = require('express')
const cors = require('cors')
const axios = require('axios')

const PORT = process.env.PORT || 5000

const app = express()
app.use(cors())

const axiosLinkedinInstance = axios.create({
    baseURL: 'https://api.linkedin.com/v2',
})

const getAccessToken = async (code) => {
    try {
        return await axios.post('https://www.linkedin.com/oauth/v2/accessToken', null, {
            params: {
                grant_type: 'authorization_code',
                code,
                redirect_uri: 'http://localhost:5000/login',
                client_id: process.env.CLIENT_ID,
                client_secret: process.env.CLIENT_SECRET
            }
        })
    } catch (e) {
        console.warn(e)
    }
}

const authInfo = {}

const setAuthInfo = (localizedFirstName, avatarUrl) => {
    authInfo.username = localizedFirstName
    authInfo.avatarUrl = avatarUrl
}

app.get('/login', async (req, res) => {
    const { data: { access_token: accessToken } } = await getAccessToken(req.query.code)
    try {
        const { data } = await axiosLinkedinInstance
            .get('me?projection=(localizedFirstName,profilePicture(displayImage~:playableStreams))', {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            })

        const { localizedFirstName, profilePicture: { 'displayImage~': { elements } } } = data
        const avatarUrl = elements[0].identifiers[0].identifier

        setAuthInfo(localizedFirstName, avatarUrl)

        res.redirect(`http://localhost:3000/login?loginSuccess=true`)
    } catch (e) {
        console.warn(e)
    }
})

app.get('/me', (req, res) => {
    if (Object.keys(authInfo).length !== 0) {
        res.send(authInfo)
    } else {
        res.status(404).send({ error: 'auth info doesnt exist, try to login again' })
    }
})

app.post('/avatar', (req, res) => {
    res.send(req.body)
})

const start = () => {
    try {
        app.listen(PORT, () => {
            console.log(`server started on port ${PORT}`)
        })
    } catch (e) {
        console.warn(e)
    }
}

start()