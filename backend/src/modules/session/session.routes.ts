import { Router} from "express"
import {sessionController} from "./session.module";
import {authenticateJWT} from "../../common/strategies/jwt.strategy";

const sessionRoutes = Router()

sessionRoutes.get("/all", authenticateJWT, sessionController.getAllSession)

export default sessionRoutes