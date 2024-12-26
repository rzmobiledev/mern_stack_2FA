import {LoginDto, RegisterDto} from "../../common/interface/auth.interface";
import UserModel from "../../database/models/user.model";
import {BadRequestException, UnauthorizedException} from "../../common/utils/catch-errors";
import {ErrorCode} from "../../common/enums/error_code.enum";
import VerificationCodeModel from "../../database/models/verification.model";
import {VerificationEnum} from "../../common/enums/verification.code.enum";
import {calculateExpirationDate, fortyFiveMinutesFromNow, ONE_DAY_IN_MS} from "../../common/utils/date-time";
import SessionModel from "../../database/models/session.model";
import { config, appConfigType } from "../../config/app.config"
import {signJWTToken, refreshTokenSignOptions, verifyJwtToken, RefreshTPayload} from "../../common/utils/jwt";

export class AuthService {
    public async register(registerData: RegisterDto){
        const {name, email, password} = registerData;

        const existingUser = await UserModel.exists({email});

        if(existingUser){
            throw new BadRequestException("User already exists with this email", ErrorCode.AUTH_EMAIL_ALREADY_EXISTS);
        }

        const newUser = await UserModel.create({name, email, password});

        const userId = newUser._id

        const verificationCode = await VerificationCodeModel.create({
            userId,
            type: VerificationEnum.EMAIL_VERIFICATION,
            createdAt: new Date(),
            expiresAt: fortyFiveMinutesFromNow()
        })

        // sending verification email link
        return {
            user: newUser
        }
    }

    public async login(loginData: LoginDto){
        const conf: appConfigType = config
        const {email, password, userAgent} = loginData
        const user = await UserModel.findOne({email})
        if(!user){
            throw new BadRequestException(
                "Invalid email or password provided",
                ErrorCode.AUTH_USER_NOT_FOUND
            )
        }

        const isPasswordValid: boolean = await user.comparePassword(password)
        if(!isPasswordValid){
            throw new BadRequestException(
                "Invalid email or password provided",
                ErrorCode.AUTH_USER_NOT_FOUND
            )
        }

        const session = await SessionModel.create({
            userId: user._id,
            userAgent: userAgent,
        })

        const accessToken = signJWTToken({
            userId: user._id,
            sessionId: session._id
        })

        const refreshToken = signJWTToken({
            sessionId: session._id,
        }, refreshTokenSignOptions)

        return {
            user,
            accessToken,
            refreshToken,
            mfaRequired: false
        }
    }

    public async refreshToken(refreshToken: string): Promise<Record<string, string | undefined>>{
        const { payload } = verifyJwtToken<RefreshTPayload>(refreshToken)

        if(!payload) throw new UnauthorizedException("Invalid refresh token")

        const session = await SessionModel.findById(payload.sessionId)
        const now: number = Date.now()

        if(!session) throw new UnauthorizedException("Session does not exist")

        if(session.expiredAt.getTime() < now) throw new UnauthorizedException("Session expired")

        const sessionRequiresRefresh: boolean = (session.expiredAt.getTime() - now) < ONE_DAY_IN_MS

        if(sessionRequiresRefresh) {
            session.expiredAt = calculateExpirationDate(config.JWT.REFRESH_EXPIRES_IN)
            await session.save()
        }

        const newRefreshToken = sessionRequiresRefresh ? signJWTToken({sessionId: session._id}, refreshTokenSignOptions) : undefined

        const accessToken = signJWTToken({
            userId: session.userId,
            sessionId: session._id
        })

        return {
            accessToken,
            newRefreshToken
        }
    }
}