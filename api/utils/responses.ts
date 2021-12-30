import { Response } from "express"
import { ApiResponse } from "~/interfaces/misc";

export const successResponse = async (res: Response, data: any) => {

    if (data) {
        const response: ApiResponse = {
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
            message: 'Where are your dreams? Where is the life they promised you? You follow the rules, you follow the directions, but the destination only recedes as you approach. Where is the content you were seeking? No one knows. This is just a 404 page.',
            code: 404
        }
    };

    res.json(response);
}
