import "dotenv/config"
import express, {Express, Request, Response, NextFunction} from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import {config} from "./config/app.config";
import connectDatabase from "./database/db";
import {errorHandler} from "./middleware/errorHandler";
import {HTTP_STATUS} from "./config/http.config";
import {asyncHandler} from "./middleware/asyncHandler";
import authRoutes from "./modules/auth/auth.routes";
import passport from "./middleware/passport";

const app: Express = express()
const BASE_PATH: string = config.BASE_PATH

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors({
    origin: config.APP_ORIGIN,
    credentials: true
}))

app.use(cookieParser())
app.use(passport.initialize())

app.get('/', asyncHandler(async(req: Request, res: Response): Promise<void> => {
    res.status(HTTP_STATUS.OK).json({
        message: 'Welcome to MERN AUTH'
    });
}))

app.use(`${BASE_PATH}/auth`, authRoutes)

app.use(errorHandler)

app.listen(config.PORT, async() => {
    console.log(`Server is running and listening on port ${config.PORT}`)
    await connectDatabase()
})