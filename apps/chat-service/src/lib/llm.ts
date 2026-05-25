import OpenAI from "openai";

const apiKey = process.env.OPENAI_API_KEY;

if (!apiKey) {
    throw new Error("OPENAI_API_KEY is missing");
}

export const openai = new OpenAI({
    apiKey
});

export async function chatWithOpenAI(message: string) {
    try {
        const response = await openai.responses.create({
            model: process.env.OPENAI_MODEL || "gpt-5-nano",
            input: message,
        })

        return response.output_text;
    } catch (error) {
        if (error instanceof Error) {
            console.error("Error chatting with LLM:", error?.message);
            throw new Error(error?.message);
        }
        console.error("Unexpected error chatting with LLM:", error);
        throw new Error("An unexpected error occurred");
    }
}