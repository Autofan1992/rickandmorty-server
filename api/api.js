import axios from 'axios'

export const axiosLinkedinInstance = axios.create({
    baseURL: 'https://api.linkedin.com/v2',
})
