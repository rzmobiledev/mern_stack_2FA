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

type SessionType = {
    _id: string;
    userId: string;
    userAgent: string;
    createdAt: string;
    expiresAt: string;
    isCurrent: boolean;
}

type SessionResponseType = {
    message: string;
    sessions: SessionType[];
}

type verifyEmailType = { code: string };
type verifyMFAType = { code: string; secretKey: string };
type mfaLoginType = { code: string; email: string };

export type mfaType = {
    message: string;
    secret: string;
    qrImageUrl: string;
};

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

export const logoutMutationFn: () => Promise<AxiosXHR<unknown>> = async ():Promise<AxiosXHR<unknown>> =>
    await API.post("/auth/logout")

export const getUserSessionQueryFn: () => Promise<AxiosXHR<unknown>> = async (): Promise<AxiosXHR<unknown>> => await API.get(`/session/`)

export const sessionsQueryFn: () => Promise<SessionResponseType> = async (): Promise<SessionResponseType> => {
    const response: AxiosXHR<SessionResponseType> = await API.get<SessionResponseType>(`/session/all`)
    return response.data;
}

export const sessionDelMutationFn: (id: string) => Promise<AxiosXHR<unknown>> = async (id: string):Promise<AxiosXHR<unknown>> =>
    await API.delete(`/session/${id}`)

export const verifyMFAMutationFn: (data: verifyMFAType) => Promise<AxiosXHR<unknown>> = async (data: verifyMFAType):Promise<AxiosXHR<unknown>> =>
    await API.post(`/mfa/verify`, data)

export const mfaSetupQueryFn: () => Promise<mfaType> = async () : Promise<mfaType> => {
    const response: AxiosXHR<mfaType> = await API.get<mfaType>(`/mfa/setup`)
    return response.data;
}

export const revokeMFAMutationFn: () => Promise<AxiosXHR<unknown>> = async (): Promise<AxiosXHR<unknown>> => await API.put(`/mfa/revoke`, {})

export const verifyMFALoginMutationFn: (data: mfaLoginType) => Promise<AxiosXHR<unknown>> = async (data: mfaLoginType): Promise<AxiosXHR<unknown>> =>
    await API.post(`/mfa/verify-login`, data)