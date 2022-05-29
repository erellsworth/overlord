import { Response } from "express";
import { ApiResponse } from "../../interfaces/misc";

export const successResponse = async <T>(res: Response, data: T) => {

    if (data) {
        const response: ApiResponse<T> = {
            success: Boolean(data),
            data
        };
        res.json(response);
    } else {
        // this is just a fallback. successResponse should not be called if there is no data
        notFoundResponse(res);
    }
}

export const notFoundResponse = async (res: Response) => {


    const response: ApiResponse = {
        success: false,
        error: { // TODO: Fetch random 404 messages from database
            message: 'Page not found',
            code: 404
        }
    };

    res.json(response);
}
