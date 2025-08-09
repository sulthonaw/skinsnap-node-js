import { prisma } from "@/prisma/client";
import { ApiError } from "@/utils/ApiError";
import { StatusCodes } from "http-status-codes";

interface LocationParams {
  latitude: number;
  longitude: number;
  radius: number;
}

export const findNearbyDoctors = async (params: LocationParams) => {
  const { latitude, longitude, radius } = params;

  if (isNaN(latitude) || isNaN(longitude)) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Invalid latitude or longitude values.");
  }

  const query = `
    SELECT id, name, specialty, address, "phoneNumber", latitude, longitude,
           (6371 * acos(cos(radians(${latitude})) * cos(radians(latitude)) * cos(radians(longitude) - radians(${longitude})) + sin(radians(${latitude})) * sin(radians(latitude)))) AS distance
    FROM "doctors"
    WHERE (6371 * acos(cos(radians(${latitude})) * cos(radians(latitude)) * cos(radians(longitude) - radians(${longitude})) + sin(radians(${latitude})) * sin(radians(latitude)))) * 1000 <= ${radius}
    ORDER BY distance;
  `;

  try {
    const doctors = await prisma.$queryRawUnsafe(query);
    return doctors;
  } catch (error) {
    console.error("Error fetching nearby doctors:", error);
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, "Could not fetch nearby doctors.");
  }
};
