import jwt from 'jsonwebtoken'
import {LoginDto, RegisterDto} from "../../common/interface/auth.interface";
import UserModel from "../../database/models/user.model";
import {BadRequestException} from "../../common/utils/catch-errors";
import {ErrorCode} from "../../common/enums/error_code.enum";
import VerificationCodeModel from "../../database/models/verification.model";
import {VerificationEnum} from "../../common/enums/verification.code.enum";
import {fortyFiveMinutesFromNow} from "../../common/utils/date-time";
import SessionModel from "../../database/models/session.model";
import { config, appConfigType } from "../../config/app.config"

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

        const accessToken = jwt.sign(
            {
                userId: user._id,
                sessionId: session._id
            },
            conf.JWT.SECRET,
            {
                audience: ["user"],
                expiresIn: conf.JWT.EXPIRES_IN
            }
        )

        const refreshToken = jwt.sign(
            { sessionId: session._id },
            conf.JWT.REFRESH_SECRET,
            {
                audience: ["user"],
                expiresIn: conf.JWT.REFRESH_EXPIRES_IN
            }
        )

        return {
            user,
            accessToken,
            refreshToken,
            mfaRequired: false
        }
    }
}