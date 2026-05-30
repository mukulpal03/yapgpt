import { Message } from "../hooks/useChat";

interface ChatBubbleProps {
  message: Message;
}

export function ChatBubble({ message }: ChatBubbleProps) {
  const isBot = message?.sender === "bot";

  if (!isBot) {
    return (
      <div className="flex justify-end animate-in fade-in slide-in-from-bottom-2 duration-200">
        <div
          className="
            max-w-[75%]
            rounded-2xl rounded-br-sm
            bg-primary text-primary-foreground
            px-4 py-2.5
            text-sm leading-relaxed
            shadow-sm
            whitespace-pre-wrap break-words
          "
        >
          {message?.text}
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-3 animate-in fade-in slide-in-from-bottom-2 duration-200">
      {/* Bot avatar */}
      <div
        className="
          w-6 h-6 rounded-full
          border border-border
          bg-card
          mt-0.5 shrink-0
          flex items-center justify-center
        "
      >
        <span className="text-[9px] font-semibold text-muted-foreground select-none">
          AI
        </span>
      </div>

      {/* Bot message — no bubble, just flowing text */}
      <div
        className="
          flex-1 min-w-0
          text-sm leading-relaxed
          text-foreground
          whitespace-pre-wrap break-words
          pt-0.5
        "
      >
        {message?.text}
      </div>
    </div>
  );
}
