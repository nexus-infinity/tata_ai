import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { token } = await request.json()

    if (!token) {
      return NextResponse.json({ error: "Token is required" }, { status: 400 })
    }

    // Test the token by making a request to Hugging Face API
    const response = await fetch("https://huggingface.co/api/models", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      return NextResponse.json({ error: "Invalid token or API error", status: response.status }, { status: 400 })
    }

    // Return success with some basic info
    return NextResponse.json({
      valid: true,
      message: "Token is valid",
      timestamp: new Date().toISOString(),
    })
  } catch (error: any) {
    console.error("Error validating Hugging Face token:", error)
    return NextResponse.json({ error: error.message || "An error occurred" }, { status: 500 })
  }
}

