export type InferenceLogs = {
  model?: string;
  provider?: string;
  latencyInMs?: number;
  inputTokens?: number;
  outputTokens?: number;
  totalTokens?: number;
  input?: {
    preview?: string;
  };
  output?: {
    preview?: string;
  };
  timestamps?: {
    requestStartedAt?: Date;
    completedAt?: Date;
    providerCreatedAt?: Date;
  };
  status?: string;
  error?: unknown;
  errorMessage?: string;
  errorCode?: string;
  incomplete_details?: unknown;
  [key: string]: unknown;
};
