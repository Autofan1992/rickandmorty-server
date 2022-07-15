import axios from 'axios'
import { axiosLinkedinInstance } from '../api/api.js'

const authInfo = {}

const setAuthInfo = (localizedFirstName, avatarUrl) => {
    authInfo.username = localizedFirstName
    authInfo.avatarUrl = avatarUrl
}

export const getUserAuthInfo = (req, res) => {
    if (Object.keys(authInfo).length !== 0) {
        res.send(authInfo)
    } else {
        res.status(404).send({ error: 'auth info doesnt exist, try to login again' })
    }
}

const getAccessToken = async (code) => {
    try {
        return await axios.post('https://www.linkedin.com/oauth/v2/accessToken', null, {
            params: {
                grant_type: 'authorization_code',
                code,
                redirect_uri: 'https://rickandmorty-linkedin.herokuapp.com/login',
                client_id: '782l68t2mkud14',
                client_secret: 'ADXPTQd5AaLjgVL0'
            }
        })
    } catch (e) {
        console.warn(e)
    }
}

export const getLinkedinAuthInfo = async (req, res) => {
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

        res.redirect(`https://rick-and-morty-8.netlify.app/login?loginSuccess=true`)
    } catch (e) {
        console.warn(e)
    }
}