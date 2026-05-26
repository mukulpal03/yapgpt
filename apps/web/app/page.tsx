"use client";

import { useRef, useState } from "react";
import { ArrowUp } from "lucide-react";
import { Button } from "@repo/ui/components/ui/button";
import { Textarea } from "@repo/ui/components/ui/textarea";
import { ChatArea } from "../components/chat-area";
import { useChat } from "../hooks/useChat";

export default function Home() {
  const { messages, isLoading, error, sendMessage } = useChat();
  const [input, setInput] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    const message = input;
    setInput("");

    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }

    await sendMessage(message);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void handleSend();
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = `${e.target.scrollHeight}px`;
  };

  const handleSuggestion = (text: string) => {
    setInput(text);
    textareaRef.current?.focus();
  };

  return (
    <main className="flex h-screen flex-col overflow-hidden bg-background text-foreground">
      <ChatArea
        messages={messages}
        isLoading={isLoading}
        error={error}
        onSuggestionClick={handleSuggestion}
      />

      <div className="z-10 shrink-0 border-t border-border bg-background/80 px-4 py-4 backdrop-blur-md">
        <div className="mx-auto max-w-2xl">
          <div className="flex items-end gap-2 rounded-2xl border border-input bg-card px-4 py-3 shadow-sm transition-colors focus-within:ring-1 focus-within:ring-ring">
            <Textarea
              ref={textareaRef}
              value={input}
              onChange={handleInput}
              onKeyDown={handleKeyDown}
              placeholder="Message YapGPT…"
              disabled={isLoading}
              rows={1}
              className="min-h-[24px] max-h-[160px] flex-1 resize-none border-0 bg-transparent p-0 text-sm leading-relaxed shadow-none placeholder:text-muted-foreground focus-visible:ring-0 focus-visible:ring-offset-0 scrollbar-none"
              autoFocus
            />
            <Button
              type="button"
              size="icon"
              disabled={!input.trim() || isLoading}
              onClick={() => void handleSend()}
              className="h-8 w-8 shrink-0 rounded-xl disabled:pointer-events-none disabled:opacity-40"
            >
              <ArrowUp className="h-4 w-4" />
              <span className="sr-only">Send message</span>
            </Button>
          </div>
          <p className="mt-2 text-center text-xs text-muted-foreground">
            Enter to send · Shift+Enter for new line
          </p>
        </div>
      </div>
    </main>
  );
}
