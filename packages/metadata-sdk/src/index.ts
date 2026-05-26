import OpenAI from "openai";

const apiKey = process.env.OPENAI_API_KEY;

if (!apiKey) {
  throw new Error("OPENAI_API_KEY is missing");
}

export const openai = new OpenAI({
  apiKey,
});

export const generateInferenceLogs = ({ ...rest }) => {
  return {
    ...rest,
  };
};

let previousResponse: string | null = null;

export async function generateLLMResponse(message: string) {
  try {
    const start = performance.now();
    const startedAt = new Date();

    const response = await openai.responses.create({
      model: process.env.OPENAI_MODEL || "gpt-5-nano",
      input: message,
      previous_response_id: previousResponse,
    });

    const end = performance.now();
    const completedAt = new Date();

    previousResponse = response.id;

    const inferenceLogs = generateInferenceLogs({
      model: response.model,
      provider: "openai",
      latencyInMs: end - start,
      inputTokens: response.usage?.input_tokens,
      outputTokens: response.usage?.output_tokens,
      totalTokens: response.usage?.total_tokens,
      input: {
        preview: message.slice(0, 500),
      },
      output: {
        preview: response.output_text?.slice(0, 500),
      },
      timestamps: {
        requestStartedAt: startedAt,
        completedAt,
        providerCreatedAt: response.created_at
          ? new Date(response.created_at * 1000)
          : undefined,
      },
      status: response.status,
      error: response.error,
      errorMessage: response.error?.message,
      errorCode: response.error?.code,
      incomplete_details: response.incomplete_details,
    });

    return response;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to call LLM with metadata");
  }
}
