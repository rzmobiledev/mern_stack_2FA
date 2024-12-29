import {
    ExtractJwt,
    StrategyOptionsWithoutRequest,
    Strategy,
    VerifiedCallback, VerifyCallbackWithRequest, VerifyCallback,
} from "passport-jwt";
import {PassportStatic} from "passport";
import {NextFunction, Request} from "express"
import {UnauthorizedException} from "../utils/catch-errors";
import {ErrorCode} from "../enums/error_code.enum";
import {config} from "../../config/app.config";
import {userService} from "../../modules/user/user.module";
import passport from "passport";
import {AppError} from "../utils/AppError";


interface JwtPayload {
    userId: string
    sessionId: string
}

const options: StrategyOptionsWithoutRequest = {
    jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => {
            const accessToken = req.cookies.accessToken
            if(!accessToken) throw new UnauthorizedException(
                "Unauthorized access token",
                ErrorCode.AUTH_TOKEN_NOT_FOUND
            )
            return accessToken
        }
    ]),
    secretOrKey: config.JWT.SECRET,
    audience: ["user"],
    algorithms: ["HS256"],
    passReqToCallback: false,
}


class NewStrategy extends Strategy {
    constructor(opt: StrategyOptionsWithoutRequest, verify: VerifiedCallback, req: Request) {
        super(opt, verify);
    }
}

export const setupJwtStrategy = (passport: PassportStatic) => {

    passport.use(new Strategy(options, async(payload: JwtPayload, done: VerifiedCallback): Promise<void> => {
        try{
            const user = await userService.findUserById(payload.userId)
            if(!user) {
                return done(null,  false)
            }
            return done(null, user, payload)
        }catch(err){
            return done(err, false)
        }
    }))
}

export const authenticateJWT = passport.authenticate('jwt', {session: false})