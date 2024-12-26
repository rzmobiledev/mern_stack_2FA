import {asyncHandler} from "../../middleware/asyncHandler";
import {Request, Response} from "express";
import {HTTP_STATUS} from "../../config/http.config";
import {loginSchema, registerSchema} from "../../common/validators/auth.validator";
import {AuthService} from "./auth.service";
import {
    getAccessTokenCookieOptions,
    getRefreshTokenCookieOptions,
    setAuthenticationCookies
} from "../../common/utils/cookie";
import {UnauthorizedException} from "../../common/utils/catch-errors";


export class AuthController {
    private authService: AuthService;

    constructor(authService: AuthService) {
        this.authService = authService;
    }

    public register = asyncHandler(async (req: Request, res: Response): Promise<any> => {
        const userAgent = req.headers['user-agent'];
        const body = registerSchema.parse(req.body)
        const { user } = await this.authService.register(body)
        return res.status(HTTP_STATUS.CREATED).json({
            message: "User registered successfully",
            data: user
        })
    })

    public login = asyncHandler(async (req: Request, res: Response): Promise<any> => {
        const userAgent = req.headers['user-agent'];
        const body = loginSchema.parse({
            ...req.body,
            userAgent: userAgent
        })

        const { user, accessToken, refreshToken, mfaRequired } = await this.authService.login(body)

        return setAuthenticationCookies(
            res,
            accessToken,
            refreshToken,
        ).status(HTTP_STATUS.OK).json({
            message: "User login successfully",
            mfaRequired,
            user
        })
    })

    public refreshToken = asyncHandler(async (req: Request, res: Response): Promise<any> => {
        const refreshToken = await req.cookies.get("refreshToken") as string
        if(!refreshToken) throw new UnauthorizedException("User not Authorized")

        const {accessToken, newRefreshToken} = await this.authService.refreshToken(refreshToken)
        if(newRefreshToken) res.cookie("refreshToken", newRefreshToken, getRefreshTokenCookieOptions())

        return res.status(HTTP_STATUS.OK)
            .cookie("accessToken", accessToken, getAccessTokenCookieOptions())
            .json({message: "Refresh access token successfully"})
    })
}