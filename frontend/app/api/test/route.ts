import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()

    return NextResponse.json({
      message: "Echo API",
      receivedData: body,
      timestamp: new Date().toISOString(),
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "An error occurred" }, { status: 400 })
  }
}

