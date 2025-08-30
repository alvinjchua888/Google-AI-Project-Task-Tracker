
import { GoogleGenAI, Type } from "@google/genai";
import type { TaskSuggestion } from "../types";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const responseSchema = {
    type: Type.ARRAY,
    items: {
      type: Type.OBJECT,
      properties: {
        title: {
          type: Type.STRING,
          description: 'A concise title for the development task.',
        },
        description: {
          type: Type.STRING,
          description: 'A brief, one-sentence description of what the task involves.',
        },
      },
      required: ["title", "description"]
    },
};

export const generateTaskSuggestions = async (
  projectName: string,
  projectDescription: string
): Promise<TaskSuggestion[]> => {
  try {
    const prompt = `
      You are an expert project manager for Python software projects.
      Based on the following project, generate a list of 5 to 7 granular development tasks to get started.
      The tasks should be actionable and clear for a developer.
      
      Project Name: "${projectName}"
      Description: "${projectDescription}"

      Provide the output as a valid JSON array of objects, conforming to the provided schema.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.7,
      },
    });

    const jsonString = response.text;
    const parsedJson = JSON.parse(jsonString);

    if (!Array.isArray(parsedJson)) {
        throw new Error("AI response is not a JSON array.");
    }

    // Basic validation
    const validatedTasks: TaskSuggestion[] = parsedJson.filter(item => 
        typeof item === 'object' && 
        item !== null && 
        typeof item.title === 'string' && 
        typeof item.description === 'string'
    );

    return validatedTasks;

  } catch (error) {
    console.error("Error generating task suggestions:", error);
    throw new Error("Failed to get suggestions from AI. Please check your API key and try again.");
  }
};
