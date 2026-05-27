import OpenAI from "openai";
import { sendInferenceLogs } from "./ingest.js";
import type { GenerateLLMResult, InferenceLogs, LLMError } from "./types.js";

const apiKey = process.env.OPENAI_API_KEY;

if (!apiKey) {
  throw new Error("OPENAI_API_KEY is missing");
}

export const openai = new OpenAI({
  apiKey,
});

export const generateInferenceLogs = (data: InferenceLogs): InferenceLogs => {
  return {
    ...data,
  };
};

let previousResponse: string | null = null;

const defaultModel = () => process.env.OPENAI_MODEL ?? "gpt-5-nano";

function buildLogs(
  message: string,
  startedAt: Date,
  completedAt: Date,
  latencyInMs: number,
  overrides: Partial<InferenceLogs> & Pick<InferenceLogs, "status">
): InferenceLogs {
  return generateInferenceLogs({
    model: overrides.model ?? defaultModel(),
    provider: "openai",
    latencyInMs,
    inputTokens: overrides.inputTokens ?? 0,
    outputTokens: overrides.outputTokens ?? 0,
    totalTokens: overrides.totalTokens ?? 0,
    input: overrides.input ?? { preview: message.slice(0, 500) },
    output: overrides.output ?? { preview: "" },
    timestamps: {
      requestStartedAt: startedAt,
      completedAt,
      providerCreatedAt: overrides.timestamps?.providerCreatedAt,
    },
    status: overrides.status,
    error: overrides.error,
    errorMessage: overrides.errorMessage,
    errorCode: overrides.errorCode,
    incomplete_details: overrides.incomplete_details,
  });
}

function logsFromResponse(
  message: string,
  response: OpenAI.Responses.Response,
  startedAt: Date,
  completedAt: Date,
  latencyInMs: number
): InferenceLogs {
  return buildLogs(message, startedAt, completedAt, latencyInMs, {
    model: response.model ?? defaultModel(),
    inputTokens: response.usage?.input_tokens ?? 0,
    outputTokens: response.usage?.output_tokens ?? 0,
    totalTokens: response.usage?.total_tokens ?? 0,
    output: { preview: response.output_text?.slice(0, 500) ?? "" },
    timestamps: {
      requestStartedAt: startedAt,
      completedAt,
      providerCreatedAt: response.created_at
        ? new Date(response.created_at * 1000)
        : undefined,
    },
    status: response.status ?? "unknown",
    error: response.error
      ? { message: response.error.message, code: response.error.code }
      : undefined,
    errorMessage: response.error?.message,
    errorCode: response.error?.code,
    incomplete_details: response.incomplete_details
      ? { reason: String(response.incomplete_details) }
      : undefined,
  });
}

function logsFromFailure(
  message: string,
  startedAt: Date,
  completedAt: Date,
  latencyInMs: number,
  error: LLMError
): InferenceLogs {
  return buildLogs(message, startedAt, completedAt, latencyInMs, {
    status: "failed",
    error: { message: error.message, code: error.code },
    errorMessage: error.message,
    errorCode: error.code,
  });
}

function toLLMError(error: unknown): LLMError {
  if (error instanceof OpenAI.APIError) {
    return {
      message: error.message,
      code: error.code ?? String(error.status),
    };
  }

  if (error instanceof Error) {
    return { message: error.message };
  }

  return { message: "An unexpected error occurred while calling the LLM." };
}

function isResponseFailure(response: OpenAI.Responses.Response): boolean {
  return (
    response.status === "failed" ||
    response.status === "incomplete" ||
    response.status === "cancelled" ||
    Boolean(response.error)
  );
}

function failureFromResponse(
  response: OpenAI.Responses.Response
): LLMError {
  if (response.error?.message) {
    return {
      message: response.error.message,
      code: response.error.code,
    };
  }

  if (response.status === "incomplete" && response.incomplete_details) {
    return {
      message: `Response incomplete: ${String(response.incomplete_details)}`,
      code: "incomplete",
    };
  }

  return {
    message: `LLM request ended with status: ${response.status ?? "unknown"}`,
    code: response.status,
  };
}

export async function generateLLMResponse(
  message: string
): Promise<GenerateLLMResult> {
  const start = performance.now();
  const startedAt = new Date();

  try {
    const response = await openai.responses.create({
      model: defaultModel(),
      input: message,
      previous_response_id: previousResponse,
    });

    const completedAt = new Date();
    const latencyInMs = performance.now() - start;

    const inferenceLogs = logsFromResponse(
      message,
      response,
      startedAt,
      completedAt,
      latencyInMs
    );
    sendInferenceLogs(inferenceLogs);

    if (isResponseFailure(response)) {
      return {
        success: false,
        error: failureFromResponse(response),
      };
    }

    previousResponse = response.id;

    return {
      success: true,
      outputText: response.output_text ?? "",
    };
  } catch (error) {
    const completedAt = new Date();
    const latencyInMs = performance.now() - start;
    const llmError = toLLMError(error);

    console.error("LLM request failed:", llmError.message);

    const inferenceLogs = logsFromFailure(
      message,
      startedAt,
      completedAt,
      latencyInMs,
      llmError
    );
    sendInferenceLogs(inferenceLogs);

    return {
      success: false,
      error: llmError,
    };
  }
}

export type { InferenceLogs, GenerateLLMResult, LLMError } from "./types.js";
export { sendInferenceLogs } from "./ingest.js";
