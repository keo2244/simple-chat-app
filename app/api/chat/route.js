import { GoogleGenerativeAI } from "@google/generative-ai"
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
const PROMPT = "You are a professional AI sales assistant. Greet customers, present products, answer questions, and close sales. Reply short and friendly with emoji. Reply in the same language as the customer (Lao, Thai, or English)."
export async function POST(request) {
  try {
    const { messages } = await request.json()
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash", systemInstruction: PROMPT })
    const history = messages.slice(0,-1).map(m => ({ role: m.role==="assistant"?"model":"user", parts:[{text:m.content}] }))
    const chat = model.startChat({ history })
    const result = await chat.sendMessage(messages[messages.length-1].content)
    return Response.json({ reply: result.response.text() })
  } catch(e) {
    return Response.json({ error: e.message }, { status: 500 })
  }
}