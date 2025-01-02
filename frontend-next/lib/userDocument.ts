export interface UserPreferences {
    enable2FA: boolean
    emailNotification: boolean
    twoFactorSecret?: string
}

export interface UserDocument {
    name: string
    email: string
    password: string
    isEmailVerified: boolean
    createdAt: Date
    updatedAt: Date
    userPreferences: UserPreferences
    comparePassword: (password: string) => Promise<boolean>
}

export type UserData = {
    message: string
    mfaRequired: boolean
    data: UserDocument
}

export type MfaResponseType = {
    message: string
    user: UserDocument
}