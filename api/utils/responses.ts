import { Response } from 'express';
import { ApiResponse } from '../../interfaces/misc';

export const successResponse = async <T>(res: Response, data: T) => {
  if (data) {
    const response: ApiResponse<T> = {
      success: Boolean(data),
      data,
    };
    res.json(response);
  } else {
    // this is just a fallback. successResponse should not be called if there is no data
    notFoundResponse(res);
  }
};

export const errorResponse = async (
  res: Response,
  message: string,
  code: number = 500,
) => {
  const response: ApiResponse = {
    success: false,
    error: {
      message,
      code,
    },
  };

  res.json(response);
};

export const notFoundResponse = async (
  res: Response,
  contentType: string = 'Content',
) => {
  errorResponse(res, `${contentType} not found`, 404);
};
