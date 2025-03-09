import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { token } = await request.json()

    if (!token) {
      return NextResponse.json({ error: "Token is required" }, { status: 400 })
    }

    // Make a request to Hugging Face API to list models
    const response = await fetch("https://huggingface.co/api/models?limit=10", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      return NextResponse.json({ error: "API error", status: response.status }, { status: 400 })
    }

    const models = await response.json()

    return NextResponse.json({
      success: true,
      models,
      count: models.length,
      timestamp: new Date().toISOString(),
    })
  } catch (error: any) {
    console.error("Error listing Hugging Face models:", error)
    return NextResponse.json({ error: error.message || "An error occurred" }, { status: 500 })
  }
}

