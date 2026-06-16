import { NextRequest, NextResponse } from 'next/server'
import ZAI from 'z-ai-web-dev-sdk'

const SYSTEM_PROMPT = `You are the AI assistant for Chohan's Style Hub, a premium multi-branch hair salon and beauty academy in Pakistan. 
You help customers with:
- Recommending hairstyles and services based on their preferences
- Booking appointments and answering FAQ about services, pricing, branches
- Bridal makeup and mehndi inquiries
- Course information for the beauty academy
- General grooming and styling advice

Be friendly, concise, and helpful. Keep responses under 150 words. Use emojis sparingly. 
The salon has branches in Lahore (Gulberg, DHA, Johar Town) and Rawalpindi (Bahria Town).
WhatsApp contact: +923205719979. Salon hours: 9 AM - 10 PM daily.
If asked about specific prices, mention they can vary by branch and to check the booking page.`

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json()
    if (!messages?.length) return NextResponse.json({ error: 'No messages' }, { status: 400 })

    const zai = await ZAI.create()
    const response = await zai.chat.completions.create({
      model: 'glm-4.6',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        ...messages.slice(-10).map((m: any) => ({ role: m.role, content: m.content })),
      ],
      temperature: 0.7,
      max_tokens: 300,
    })

    const reply = response.choices[0]?.message?.content || 'Sorry, I could not generate a response.'
    return NextResponse.json({ reply })
  } catch (e: any) {
    console.error('Chat error:', e)
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
