"use client"
import { useState, useRef, useEffect } from "react"
import { Send, Bot, User, Loader2 } from "lucide-react"

export default function SalesChatbot() {
  const welcome = "\u0eaa\u0eb0\u0e9a\u0eb2\u0e8d\u0e94\u0eb5! \u0e82\u0ec9\u0ead\u0e8d\u0ec1\u0ea1\u0ec8\u0e99\u0e9c\u0eb9\u0ec9\u0e8a\u0ec8\u0ea7\u0e8d\u0e82\u0eb2\u0e8d AI \ud83e\udd16 \u0ea1\u0eb5\u0eab\u0e8d\u0eb1\u0e87\u0ec3\u0eab\u0ec9\u0e8a\u0ec8\u0ea7\u0e8d?"
  const [messages, setMessages] = useState([{ role: "assistant", content: welcome }])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const bottomRef = useRef(null)
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }) }, [messages])

  const send = async () => {
    if (!input.trim() || isLoading) return
    const userMsg = { role: "user", content: input.trim() }
    setMessages(p => [...p, userMsg])
    setInput("")
    setIsLoading(true)
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [...messages, userMsg] }),
      })
      const data = await res.json()
      setMessages(p => [...p, { role: "assistant", content: data.reply }])
    } catch {
      setMessages(p => [...p, { role: "assistant", content: "\u26a0\ufe0f \u0ec0\u0e81\u0eb5\u0e94\u0e82\u0ecd\u0ec9\u0e9c\u0eb4\u0e94\u0e9e\u0eb2\u0e94 \u0ea5\u0ead\u0e87\u0ec3\u0eab\u0ea1\u0ec8." }])
    }
    setIsLoading(false)
  }

  const quickReplies = [
    "\ud83d\udcb0 \u0ea5\u0eb2\u0e84\u0eb2\u0ec0\u0e97\u0ec8\u0eb2\u0ec3\u0e94?",
    "\ud83d\udce6 \u0ea1\u0eb5\u0eaa\u0eb4\u0e99\u0e84\u0ec9\u0eb2\u0eab\u0e8d\u0eb1\u0e87?",
    "\ud83d\ude9a \u0eaa\u0ebb\u0ec8\u0e87\u0eae\u0ead\u0e94\u0ec3\u0eaa?",
    "\u2b50 \u0eae\u0eb1\u0e9a\u0e9b\u0eb0\u0e81\u0eb1\u0e99?"
  ]

  return (
    <div className="flex flex-col h-screen max-w-2xl mx-auto bg-white shadow-xl">
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white px-4 py-4 flex items-center gap-3">
        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
          <Bot className="w-6 h-6 text-blue-600" />
        </div>
        <div>
          <h1 className="font-bold text-lg">AI Sales Assistant</h1>
          <p className="text-blue-200 text-xs">{"\u0ead\u0ead\u0e99\u0ea5\u0eb2\u0e8d 24/7"}</p>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 bg-gray-50">
        {messages.map((m, i) => (
          <div key={i} className={`flex gap-2 ${m.role === "user" ? "flex-row-reverse" : ""}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${m.role === "user" ? "bg-blue-600" : "bg-white border"}`}>
              {m.role === "user" ? <User className="w-4 h-4 text-white" /> : <Bot className="w-4 h-4 text-blue-600" />}
            </div>
            <div className={`max-w-xs px-4 py-2 rounded-2xl text-sm leading-relaxed ${m.role === "user" ? "bg-blue-600 text-white rounded-tr-none" : "bg-white text-gray-800 border rounded-tl-none"}`}>
              {m.content}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-2">
            <div className="w-8 h-8 rounded-full bg-white border flex items-center justify-center">
              <Bot className="w-4 h-4 text-blue-600" />
            </div>
            <div className="bg-white border rounded-2xl rounded-tl-none px-4 py-3">
              <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>
      <div className="px-4 py-2 flex gap-2 overflow-x-auto bg-white border-t">
        {quickReplies.map((r, i) => (
          <button key={i} onClick={() => setInput(r)} className="flex-shrink-0 text-xs px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full border border-blue-200 hover:bg-blue-100">{r}</button>
        ))}
      </div>
      <div className="px-4 py-3 bg-white border-t flex gap-2">
        <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && send()}
          placeholder={"\u0e9e\u0eb4\u0ea1\u0e82\u0ecd\u0ec9\u0e84\u0ea7\u0eb2\u0ea1..."}
          className="flex-1 rounded-xl border px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50" />
        <button onClick={send} disabled={!input.trim() || isLoading}
          className="w-10 h-10 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white rounded-xl flex items-center justify-center">
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}