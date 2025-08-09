import { google } from "googleapis";
import axios from "axios";
import jwt from "jsonwebtoken";
import { config } from "@/config";
import { prisma } from "@/prisma/client";
import { ApiError } from "@/utils/ApiError";
import { StatusCodes } from "http-status-codes";

const oauth2Client = new google.auth.OAuth2(config.google.clientId, config.google.clientSecret, config.google.redirectUri);

export const getGoogleAuthURL = (): string => {
  const scopes = ["https://www.googleapis.com/auth/userinfo.profile", "https://www.googleapis.com/auth/userinfo.email"];

  return oauth2Client.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    scope: scopes,
  });
};

const generateAccessToken = (userId: string): string => {
  return jwt.sign({ id: userId }, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn,
  });
};

export const handleGoogleCallback = async (code: string) => {
  try {
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    const googleUserResponse = await axios.get("https://www.googleapis.com/oauth2/v3/userinfo", { headers: { Authorization: `Bearer ${tokens.access_token}` } });
    const googleUser = googleUserResponse.data;

    if (!googleUser.email) {
      throw new ApiError(StatusCodes.BAD_REQUEST, "Failed to retrieve email from Google.");
    }

    let user = await prisma.user.findUnique({
      where: { email: googleUser.email },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          googleId: googleUser.sub,
          email: googleUser.email,
          name: googleUser.name,
          avatarUrl: googleUser.picture,
        },
      });
    } else if (!user.googleId) {
      user = await prisma.user.update({
        where: { id: user.id },
        data: { googleId: googleUser.sub },
      });
    }

    const accessToken = generateAccessToken(user.id);

    return { user, accessToken };
  } catch (error) {
    console.error("Error during Google OAuth callback:", error);
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, "Authentication failed. Please try again.");
  }
};
