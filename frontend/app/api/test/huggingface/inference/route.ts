import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { token, modelId, prompt } = await request.json()

    if (!token || !modelId || !prompt) {
      return NextResponse.json({ error: "Token, modelId, and prompt are required" }, { status: 400 })
    }

    // Make a request to Hugging Face Inference API
    const response = await fetch(`https://api-inference.huggingface.co/models/${modelId}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ inputs: prompt }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      return NextResponse.json(
        {
          error: "Inference API error",
          status: response.status,
          details: errorText,
        },
        { status: 400 },
      )
    }

    const result = await response.json()

    return NextResponse.json({
      success: true,
      model: modelId,
      prompt,
      result,
      timestamp: new Date().toISOString(),
    })
  } catch (error: any) {
    console.error("Error running Hugging Face inference:", error)
    return NextResponse.json({ error: error.message || "An error occurred" }, { status: 500 })
  }
}

