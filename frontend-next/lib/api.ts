import API from "@/lib/axios-client"
import AxiosXHR = Axios.AxiosXHR;

type LoginType = {
    email: string
    password: string
}

type RegisterType = {
    name: string
    email: string
    password: string
    confirmPassword: string
}

export const loginMutationFn: (data: LoginType) => Promise<AxiosXHR<unknown>> = async (data: LoginType):Promise<AxiosXHR<unknown>> =>
    await API.post("/auth/login", data)

export const registerMutationFn: (data: RegisterType) => Promise<AxiosXHR<unknown>> = async (data: RegisterType):Promise<AxiosXHR<unknown>> =>
    await API.post("/auth/register", data)

