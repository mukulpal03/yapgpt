"use client";

import { useEffect, useRef } from "react";
import { AlertCircle, Sparkles } from "lucide-react";
import { Message } from "../hooks/useChat";
import { ChatBubble } from "./chat-bubble";

interface ChatAreaProps {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
  onSuggestionClick?: (text: string) => void;
}

const SUGGESTIONS = [
  "Explain quantum computing",
  "Write me a poem",
  "Debug my code",
  "Plan a trip to Japan",
];

export function ChatArea({
  messages,
  isLoading,
  error,
  onSuggestionClick,
}: ChatAreaProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  if (messages.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-6 px-4 select-none">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-border bg-card shadow-sm">
          <Sparkles className="h-6 w-6 text-muted-foreground" />
        </div>

        <div className="space-y-1.5 text-center">
          <h1 className="text-lg font-semibold tracking-tight text-foreground">
            YapGPT
          </h1>
          <p className="text-sm text-muted-foreground">
            How can I help you today?
          </p>
        </div>

        <div className="flex max-w-md flex-wrap justify-center gap-2">
          {SUGGESTIONS.map((suggestion) => (
            <button
              key={suggestion}
              type="button"
              onClick={() => onSuggestionClick?.(suggestion)}
              className="rounded-full border border-border bg-card px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-ring hover:text-foreground"
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto scroll-smooth scrollbar-none">
      <div className="mx-auto flex w-full max-w-2xl flex-col space-y-6 px-4 py-8">
        {messages.map((message) => (
          <ChatBubble key={message.id} message={message} />
        ))}

        {isLoading && (
          <div className="flex items-start gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="mt-0.5 h-7 w-7 shrink-0 animate-pulse rounded-full border border-border bg-muted" />
            <span className="animate-pulse pt-1 text-sm text-muted-foreground">
              Thinking…
            </span>
          </div>
        )}

        {error && (
          <div className="flex items-center gap-2.5 rounded-xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div ref={bottomRef} />
      </div>
    </div>
  );
}
