# AI Chatbot — UI Design Spec
> Scope: messages area + input box only. No sidebar, no nav, no history panel.

---

## Stack
- **Tailwind CSS v4**
- **shadcn/ui** components
- **Geist** font family (Geist Sans + Geist Mono) — via `next/font` or CDN

---

## Visual Direction
**Refined minimal.** Think Linear, Vercel, Raycast. Dark-first. Every element earns its place.
Calm, focused, distraction-free. The conversation is the UI.

---

## Color Tokens
Use CSS variables (shadcn convention):

```css
--background: #0a0a0a        /* near-black canvas */
--surface: #111111            /* message bubbles, input bg */
--surface-hover: #1a1a1a
--border: #222222             /* subtle dividers */
--border-focus: #444444       /* input focus ring */

--text-primary: #f5f5f5
--text-secondary: #888888     /* timestamps, labels */
--text-muted: #555555

--accent: #ffffff             /* send button, user bubble */
--accent-fg: #0a0a0a          /* text on accent */

--ai-bubble: #161616
--user-bubble: #ffffff
--user-bubble-fg: #0a0a0a
```

---

## Typography
- **Font**: Geist Sans for UI text, Geist Mono for code blocks
- **Base size**: 14px / `text-sm`
- **Line height**: 1.6 for message body (`leading-relaxed`)
- **Message text**: `text-sm text-[--text-primary] leading-relaxed`
- **Timestamp / label**: `text-xs text-[--text-secondary]`

---

## Layout Structure

```
<main> — full viewport, flex col, overflow hidden
  └── <MessageList>     — flex-1, overflow-y-auto, scroll-smooth
  └── <InputArea>       — shrink-0, pinned to bottom
```

```tsx
<main className="flex flex-col h-screen bg-[--background] text-[--text-primary]">
  <MessageList />
  <InputArea />
</main>
```

---

## MessageList

- `flex-1 overflow-y-auto scroll-smooth`
- Padding: `px-4 py-6` on mobile → `px-0 py-8` centered on desktop
- Max content width: `max-w-2xl mx-auto w-full`
- Gap between messages: `space-y-6`
- Auto-scroll to bottom on new message (smooth)
- **No scrollbar** — use `scrollbar-none` or `::-webkit-scrollbar { display: none }`

### Message Bubble

Two roles: `user` and `assistant`.

**User bubble** (right-aligned):
```tsx
<div className="flex justify-end">
  <div className="
    max-w-[75%] rounded-2xl rounded-br-sm
    bg-[--user-bubble] text-[--user-bubble-fg]
    px-4 py-2.5 text-sm leading-relaxed
    shadow-sm
  ">
    {message.content}
  </div>
</div>
```

**Assistant bubble** (left-aligned, no bubble bg — open layout):
```tsx
<div className="flex justify-start gap-3">
  {/* Optional: small AI avatar dot */}
  <div className="w-6 h-6 rounded-full bg-[--border] mt-0.5 shrink-0" />
  <div className="
    max-w-[80%] text-sm leading-relaxed text-[--text-primary]
  ">
    {message.content}
  </div>
</div>
```

> Assistant messages have **no bubble background** — raw text on canvas. Feels editorial, not chatty.

### Streaming / Typing State
- Show a blinking cursor `▍` at end of streaming text
- `animate-pulse` on the cursor character
- No skeleton loaders — just the cursor

### Code Blocks (inside assistant messages)
```tsx
<pre className="
  bg-[--surface] border border-[--border]
  rounded-xl p-4 my-3
  font-mono text-xs text-[--text-primary]
  overflow-x-auto
">
```

---

## InputArea

Pinned to bottom. Clean, no visual clutter.

```tsx
<div className="
  border-t border-[--border]
  bg-[--background]/80 backdrop-blur-md
  px-4 py-4
">
  <div className="max-w-2xl mx-auto">
    <InputBox />
  </div>
</div>
```

### InputBox Component

Use shadcn `Textarea` (auto-resizing) inside a styled wrapper:

```tsx
<div className="
  flex items-end gap-2
  bg-[--surface] border border-[--border]
  rounded-2xl px-4 py-3
  focus-within:border-[--border-focus]
  transition-colors duration-150
">
  <Textarea
    placeholder="Message..."
    className="
      flex-1 resize-none bg-transparent border-none shadow-none
      text-sm text-[--text-primary] placeholder:text-[--text-muted]
      focus-visible:ring-0 focus-visible:ring-offset-0
      min-h-[24px] max-h-[160px] leading-relaxed
      scrollbar-none
    "
    rows={1}
    onKeyDown={handleKeyDown}  /* Enter to send, Shift+Enter newline */
  />
  <SendButton />
</div>
```

### SendButton
- Visible only when input is non-empty (opacity transition)
- `bg-[--accent] text-[--accent-fg]`
- Rounded: `rounded-xl`
- Size: `h-8 w-8 shrink-0`
- Icon: Lucide `ArrowUp` (size 16)

```tsx
<Button
  size="icon"
  className="
    h-8 w-8 rounded-xl shrink-0
    bg-[--accent] text-[--accent-fg]
    hover:bg-[--accent]/90
    transition-opacity duration-150
    disabled:opacity-0 disabled:pointer-events-none
  "
  disabled={!input.trim()}
  onClick={handleSend}
>
  <ArrowUp size={16} />
</Button>
```

### Keyboard behavior
- `Enter` → send message
- `Shift + Enter` → newline
- Textarea resets to 1 row after send

---

## Empty State (no messages yet)

Centered in the MessageList area:

```tsx
<div className="flex flex-col items-center justify-center flex-1 gap-3 text-center">
  <div className="w-10 h-10 rounded-2xl bg-[--surface] border border-[--border] flex items-center justify-center">
    <Sparkles size={18} className="text-[--text-secondary]" />
  </div>
  <p className="text-sm text-[--text-secondary]">How can I help you today?</p>
</div>
```

---

## Motion & Transitions

- Messages animate in: `animate-in fade-in slide-in-from-bottom-2 duration-200`
- Input border color: `transition-colors duration-150`
- Send button opacity: `transition-opacity duration-150`
- **No bouncy springs, no dramatic entrances.** Subtle and fast.

---

## Responsive

| Breakpoint | Message padding | Max width |
|---|---|---|
| Mobile (`< md`) | `px-4` | 100% |
| Desktop (`≥ md`) | `px-8` | `max-w-2xl` centered |

---

## What to NOT build (out of scope)
- Sidebar / conversation history
- Top navbar / header
- Model selector
- Settings panel
- Regenerate / copy buttons (add later)

---

## shadcn Components Used
- `Textarea` — input
- `Button` — send button
- `ScrollArea` (optional) — message list, or native overflow

## Icons
- Lucide React: `ArrowUp`, `Sparkles`