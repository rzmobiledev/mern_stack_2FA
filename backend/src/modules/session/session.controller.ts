import {SessionService} from "./session.service";
import {asyncHandler} from "../../middleware/asyncHandler";
import {Request, Response} from "express";
import {HTTP_STATUS} from "../../config/http.config";

export class SessionController {
    private sessionService: SessionService;

    constructor(sessionService: SessionService) {
        this.sessionService = sessionService;
    }

    public getAllSession = asyncHandler(async (req: Request, res: Response): Promise<any> => {
        const userId = req.user?.id;
        const sessionId = req.sessionId;

        const { sessions } = await this.sessionService.getAllSession(userId);

        const modifySession = sessions.map(session => ({
            ...session.toObject(),
            ...(session.id === sessionId && { isCurrent: true }),
        }));

        return res.status(HTTP_STATUS.OK).json({
            message: "Retrieved all session successfully",
            sessions: modifySession
        })
    })
}