import React, { useState } from "react";

const INITIAL_MESSAGES = [
  { id: 1, from: "admin", name: "Madrasah Admin", text: "Wa alaykum salaam. How can we help today?", time: "17:40" },
  { id: 2, from: "student", name: "You", text: "I want to confirm tomorrow's lesson time.", time: "17:42" },
];

export default function MessagesPage() {
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [draft, setDraft] = useState("");

  function sendMessage() {
    if (!draft.trim()) return;

    setMessages((prev) => [
      ...prev,
      {
        id: prev.length + 1,
        from: "student",
        name: "You",
        text: draft.trim(),
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ]);
    setDraft("");
  }

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <div className="panel-base p-5">
        <p className="text-sm font-semibold text-emerald-300">Madrasah Admin</p>
        <p className="mt-1 text-xs uppercase tracking-[0.14em] text-slate-400">Ustadh Hashim - Support & Guidance</p>
      </div>

      <section className="panel-base p-5">
        <div className="scroll-thin h-[450px] space-y-3 overflow-y-auto pr-1">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.from === "student" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm ${
                  message.from === "student"
                    ? "bg-emerald-400/90 text-slate-900"
                    : "border border-emerald-300/15 bg-slate-900/70 text-slate-100"
                }`}
              >
                <p className="font-semibold">{message.name}</p>
                <p className="mt-1 leading-6">{message.text}</p>
                <p className="mt-2 text-xs opacity-80">{message.time}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 flex gap-2">
          <input
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                sendMessage();
              }
            }}
            placeholder="Type a message..."
            className="flex-1 rounded-xl border border-emerald-300/20 bg-slate-900/70 px-4 py-3 text-sm text-slate-100 outline-none placeholder:text-slate-400"
          />
          <button
            type="button"
            onClick={sendMessage}
            className="rounded-xl bg-gradient-to-b from-emerald-300 to-emerald-400 px-4 py-3 text-sm font-extrabold text-slate-900"
          >
            Send
          </button>
        </div>
      </section>
    </div>
  );
}
