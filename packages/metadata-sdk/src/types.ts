export type { InferenceLogs } from "@repo/validation";

export type LLMError = {
  message: string;
  code?: string;
};

export type GenerateLLMResult =
  | {
      success: true;
      outputText: string;
    }
  | {
      success: false;
      error: LLMError;
    };
