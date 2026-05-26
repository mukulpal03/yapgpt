import { Message } from "../hooks/useChat";

interface ChatBubbleProps {
  message: Message;
}

export function ChatBubble({ message }: ChatBubbleProps) {
  const isBot = message.sender === "bot";

  if (!isBot) {
    return (
      <div className="flex justify-end animate-in fade-in slide-in-from-bottom-2 duration-200">
        <div className="max-w-[80%] rounded-2xl rounded-br-md bg-primary px-4 py-2.5 text-sm leading-relaxed text-primary-foreground shadow-sm whitespace-pre-wrap break-words">
          {message.text}
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-3 animate-in fade-in slide-in-from-bottom-2 duration-200">
      <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-border bg-card text-[10px] font-semibold text-muted-foreground">
        AI
      </div>
      <div className="min-w-0 flex-1 pt-0.5 text-sm leading-relaxed text-foreground whitespace-pre-wrap break-words">
        {message.text}
      </div>
    </div>
  );
}
