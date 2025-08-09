import { GoogleGenerativeAI } from "@google/generative-ai";
import { config } from "@/config/index.ts";
import { prisma } from "@/prisma/client.ts";
import { ApiError } from "@/utils/ApiError.ts";
import { StatusCodes } from "http-status-codes";

const genAI = new GoogleGenerativeAI(config.geminiApiKey);

function bufferToGenerativePart(buffer: Buffer, mimeType: string) {
  return {
    inlineData: {
      data: buffer.toString("base64"),
      mimeType,
    },
  };
}

export const analyzeSkinCondition = async (file: Express.Multer.File, userId: string) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
      Analyze this image of human skin. Based on your analysis, provide the following information in a valid JSON format only, with no additional text or markdown:
      1. "skinType": One of "Oily", "Dry", "Combination", or "Normal".
      2. "acneLevel": One of "None", "Mild", "Moderate", or "Severe".
      3. "redness": One of "None", "Mild", "Moderate", or "High".
      4. "productRecommendations": An array of 3 objects. Each object should have a "productType" (e.g., "Cleanser", "Moisturizer", "Sunscreen") and a "suggestion" (a brief reason or recommended ingredient).

      Example JSON output:
      {
        "skinType": "Combination",
        "acneLevel": "Mild",
        "redness": "Mild",
        "productRecommendations": [
          { "productType": "Cleanser", "suggestion": "Use a gentle cleanser with salicylic acid." },
          { "productType": "Moisturizer", "suggestion": "A lightweight, non-comedogenic moisturizer is ideal." },
          { "productType": "Sunscreen", "suggestion": "Broad-spectrum SPF 30+ that is oil-free." }
        ]
      }
    `;

    const imagePart = bufferToGenerativePart(file.buffer, file.mimetype);

    const result = await model.generateContent([prompt, imagePart]);
    const responseText = result.response.text();

    let analysisData;
    try {
      const jsonString = responseText.replace(/```json|```/g, "").trim();
      analysisData = JSON.parse(jsonString);
    } catch (parseError) {
      console.error("Failed to parse Gemini response:", responseText);
      throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, "Failed to parse analysis result from AI service.");
    }

    const savedAnalysis = await prisma.skinAnalysis.create({
      data: {
        userId,
        imageUrl: `uploads/skin-${userId}-${Date.now()}.jpg`,
        acneLevel: analysisData.acneLevel,
        redness: analysisData.redness,
        skinType: analysisData.skinType,
        productRecommendations: analysisData.productRecommendations,
      },
    });

    return savedAnalysis;
  } catch (error) {
    console.error("Error during skin analysis with Gemini:", error);
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, "Failed to analyze skin image.");
  }
};
