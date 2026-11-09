import { FormEvent, useEffect, useRef, useState } from "react";
import { Bot, X, Send, Trash2, LoaderCircle, Sparkles, MessageCircle } from "lucide-react";

type Message = { role: "user" | "assistant"; content: string; sources?: { name: string; location?: string; url: string }[] };
const API_URL = (import.meta.env.VITE_CHAT_API_URL || "http://localhost:8787").replace(/\/$/, "");
const suggestions = ["Find trekking operators in Himachal Pradesh", "What activities are available in Rishikesh?", "Help me find a camping experience"];

export function AdventureChatbot() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [messages, setMessages] = useState<Message[]>([{ role: "assistant", content: "Hey adventurer! Ask me about activities, destinations, or operators listed on Toeddro. I'll use the available directory data and tell you when something isn't listed." }]);
  const endRef = useRef<HTMLDivElement>(null);
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" }); }, [messages, busy, open]);

  async function send(text = input) {
    const question = text.trim();
    if (!question || busy) return;
    const next = [...messages, { role: "user" as const, content: question }];
    setMessages(next); setInput(""); setBusy(true); setError("");
    try {
      const response = await fetch(`${API_URL}/api/chat`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: question, history: next.slice(-9, -1).map(({ role, content }) => ({ role, content })) }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || "The assistant is unavailable right now. Please try again.");
      setMessages((current) => [...current, { role: "assistant", content: data.answer || "I couldn't find enough information to answer that.", sources: data.sources || [] }]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Couldn't connect to the assistant. Check that the chatbot server is running.");
    } finally { setBusy(false); }
  }

  function submit(e: FormEvent) { e.preventDefault(); void send(); }
  return <>
    <button type="button" className="chat-launcher" aria-label={open ? "Close adventure assistant" : "Open adventure assistant"} aria-expanded={open} onClick={() => setOpen(v => !v)}>
      {open ? <X /> : <><MessageCircle /><span>Ask AI</span></>}
    </button>
    {open && <section className="chat-panel glass-panel" role="dialog" aria-label="Toeddro adventure assistant">
      <header className="chat-header"><div className="chat-avatar"><Bot /></div><div className="min-w-0"><p className="font-black">Adventure assistant</p><p className="text-xs opacity-75">Powered by Toeddro directory data</p></div><button type="button" aria-label="Clear chat" title="Clear chat" className="chat-icon-button ml-auto" onClick={() => { setMessages([{ role: "assistant", content: "Chat cleared. What adventure are you looking for?" }]); setError(""); }}><Trash2 size={17} /></button><button type="button" aria-label="Close chat" className="chat-icon-button" onClick={() => setOpen(false)}><X size={18} /></button></header>
      <div className="chat-messages" aria-live="polite">
        {messages.map((m, i) => <div key={i} className={`chat-message ${m.role === "user" ? "chat-user" : "chat-assistant"}`}><p className="whitespace-pre-wrap">{m.content}</p>{m.sources?.length ? <div className="chat-sources"><span className="text-xs font-bold uppercase tracking-wide">Directory sources</span>{m.sources.map(s => <a key={`${s.name}-${s.url}`} href={s.url} className="chat-source-link">{s.name}{s.location ? ` · ${s.location}` : ""} ↗</a>)}</div> : null}</div>)}
        {busy && <div className="chat-message chat-assistant flex items-center gap-2"><LoaderCircle className="animate-spin" size={16} /> Looking through the directory…</div>}
        {error && <div className="chat-error" role="alert">{error}<button type="button" onClick={() => void send(messages.filter(m => m.role === "user").slice(-1)[0]?.content || "")}>Retry</button></div>}
        {messages.length === 1 && <div className="chat-suggestions">{suggestions.map(s => <button key={s} type="button" onClick={() => void send(s)}><Sparkles size={13} />{s}</button>)}</div>}
        <div ref={endRef} />
      </div>
      <form className="chat-form" onSubmit={submit}><textarea value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); void send(); } }} maxLength={1200} rows={1} aria-label="Ask about adventures" placeholder="Ask about a destination or activity…" /><button type="submit" disabled={busy || !input.trim()} aria-label="Send message"><Send size={18} /></button><span className="sr-only">Press Enter to send; Shift+Enter for a new line.</span></form>
    </section>}
  </>;
}
