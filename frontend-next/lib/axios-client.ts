import axios from 'axios'
import AxiosXHR = Axios.AxiosXHR;

const options = {
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
    withCredentials: true,
    timeout: 10000,
}

const API = axios.create(options)

API.interceptors.response.use(
    (response: AxiosXHR<any>): AxiosXHR<any> => {
        return response
    },
    (error: any): Promise<any> => {
        const { data, status} = error.response
        if( data === "Unauthorized" && status === 401) {}
        return Promise.reject({
            ...data
        })
    }
)

export default API