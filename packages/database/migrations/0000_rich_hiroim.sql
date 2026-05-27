CREATE TABLE "inference_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"model" varchar(255) NOT NULL,
	"provider" varchar(100) NOT NULL,
	"input_tokens" integer NOT NULL,
	"output_tokens" integer NOT NULL,
	"total_tokens" integer NOT NULL,
	"latency_in_ms" real NOT NULL,
	"input" jsonb NOT NULL,
	"output" jsonb NOT NULL,
	"status" varchar(100) NOT NULL,
	"error_message" text,
	"error_code" varchar(100),
	"incomplete_details" jsonb,
	"request_started_at" timestamp with time zone NOT NULL,
	"completed_at" timestamp with time zone NOT NULL,
	"provider_created_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "inference_logs_provider_idx" ON "inference_logs" USING btree ("provider");--> statement-breakpoint
CREATE INDEX "inference_logs_model_idx" ON "inference_logs" USING btree ("model");--> statement-breakpoint
CREATE INDEX "inference_logs_status_idx" ON "inference_logs" USING btree ("status");--> statement-breakpoint
CREATE INDEX "inference_logs_created_at_idx" ON "inference_logs" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "inference_logs_request_started_at_idx" ON "inference_logs" USING btree ("request_started_at");