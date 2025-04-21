import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { groq } from "@ai-sdk/groq"

// Define the system prompt for the AI assistant
const SYSTEM_PROMPT = `
You are SkillBuddy, the helpful AI assistant for SkillSwap platform.
SkillSwap is a peer-to-peer skill exchange platform where users can teach and learn skills.
Users earn SkillTokens by teaching, which they can spend to learn from others.

Your role is to:
1. Answer questions about how SkillSwap works
2. Provide guidance on using the platform features
3. Suggest skills that might be valuable to learn or teach
4. Help with troubleshooting common issues
5. Be friendly, helpful, and concise

You should NOT:
1. Process payments or handle financial transactions
2. Access or modify user data
3. Book sessions directly
4. Make promises about specific teachers or learners
5. Provide detailed personal advice unrelated to the platform

Always maintain a helpful, positive tone and direct users to appropriate platform features.
`

interface Message {
  role: string;
  content: string;
}

interface RequestBody {
  messages: Message[];
}

export async function POST(req: NextRequest) {
  try {
    const { messages }: RequestBody = await req.json()

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Invalid request format" }, { status: 400 })
    }

    // Extract the user's message
    const userMessage = messages[messages.length - 1]?.content

    if (!userMessage) {
      return NextResponse.json({ error: "No message content provided" }, { status: 400 })
    }

    // Generate response using Groq
    const { text } = await generateText({
      model: groq("llama3-70b-8192"),
      system: SYSTEM_PROMPT,
      prompt: userMessage,
    })

    return NextResponse.json({
      role: "assistant",
      content: text,
    })
  } catch (error) {
    console.error("AI Assistant error:", error)
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 })
  }
}
