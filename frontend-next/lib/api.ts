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

type ResetPasswordType = {
    password: string
    verificationCode: string
}

export const loginMutationFn: (data: LoginType) => Promise<AxiosXHR<unknown>> = async (data: LoginType):Promise<AxiosXHR<unknown>> =>
    await API.post("/auth/login", data)

export const registerMutationFn: (data: RegisterType) => Promise<AxiosXHR<unknown>> = async (data: RegisterType):Promise<AxiosXHR<unknown>> =>
    await API.post("/auth/register", data)

export const forgotPasswordMutationFn: (data: Omit<LoginType, "password">) => Promise<AxiosXHR<unknown>> = async (data: Omit<LoginType, "password">):Promise<AxiosXHR<unknown>> =>
    await API.post("/auth/password/forgot", data)

export const resetPasswordMutationFn: (data: ResetPasswordType) => Promise<AxiosXHR<unknown>> = async (data: ResetPasswordType):Promise<AxiosXHR<unknown>> =>
    await API.post("/auth/password/reset", data)

export const verifyEmailMutationFn: (data: {code: string}) => Promise<AxiosXHR<unknown>> = async (data: {code: string}):Promise<AxiosXHR<unknown>> =>
    await API.post("/auth/verify/email", data)