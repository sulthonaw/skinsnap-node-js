import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import * as doctorService from "@/services/doctors.service.ts";
import { asyncHandler } from "@/utils/asyncHandler.ts";
import { ApiResponse } from "@/utils/ApiResponse.ts";
import { ApiError } from "@/utils/ApiError.ts";

export const getNearbyDoctors = asyncHandler(async (req: Request, res: Response) => {
  const { lat, lon, radius } = req.query;

  if (!lat || !lon) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Latitude (lat) and Longitude (lon) are required query parameters.");
  }

  const doctors = await doctorService.findNearbyDoctors({
    latitude: parseFloat(lat as string),
    longitude: parseFloat(lon as string),
    radius: radius ? parseInt(radius as string, 10) : 5000,
  });

  res.status(StatusCodes.OK).json(new ApiResponse(StatusCodes.OK, doctors, "Nearby doctors fetched successfully"));
});
