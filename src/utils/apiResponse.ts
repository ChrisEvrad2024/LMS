import { Response } from 'express';

interface ApiResponse {
  success: boolean;
  message: string;
  data?: any;
}

export const apiResponse = (
  res: Response,
  statusCode: number,
  message: string,
  data?: any
): Response<ApiResponse> => {
  return res.status(statusCode).json({
    success: statusCode >= 200 && statusCode < 300,
    message,
    data,
  });
};
