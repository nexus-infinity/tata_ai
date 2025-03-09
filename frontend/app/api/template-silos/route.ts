import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"

// GET /api/template-silos
export async function GET() {
  try {
    const templatesDir = path.join(process.cwd(), "templates")

    // Check if directory exists
    if (!fs.existsSync(templatesDir)) {
      return NextResponse.json({ templates: {} })
    }

    // Read all template files
    const files = await fs.promises.readdir(templatesDir)
    const templates: Record<string, any> = {}

    for (const file of files) {
      if (file.endsWith(".json")) {
        const filePath = path.join(templatesDir, file)
        const content = JSON.parse(await fs.promises.readFile(filePath, "utf8"))

        // Determine node type from filename or content
        let nodeType = "Unknown"
        if (file.includes("Core")) nodeType = "Core"
        else if (file.includes("Flow")) nodeType = "Flow"
        else if (file.includes("Memex")) nodeType = "Memex"
        else if (file.includes("Moto")) nodeType = "Moto"
        else if (file.includes("ZKP")) nodeType = "ZKP"
        else if (content.nodeName) {
          // Extract node type from nodeName (e.g., "Universal.TataCoreNode.JB.4.1" -> "Core")
          const parts = content.nodeName.split(".")
          for (const part of parts) {
            if (part.includes("Core")) nodeType = "Core"
            else if (part.includes("Flow")) nodeType = "Flow"
            else if (part.includes("Memex")) nodeType = "Memex"
            else if (part.includes("Moto")) nodeType = "Moto"
            else if (part.includes("ZKP")) nodeType = "ZKP"
          }
        }

        templates[nodeType] = content
      }
    }

    return NextResponse.json({ templates })
  } catch (error) {
    console.error("Error fetching templates:", error)
    return NextResponse.json({ error: "Failed to fetch templates" }, { status: 500 })
  }
}

// POST /api/template-silos
export async function POST(request: Request) {
  try {
    const { nodeType, bandId, data } = await request.json()

    if (!nodeType || !bandId || !data) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const templatesDir = path.join(process.cwd(), "templates")

    // Ensure directory exists
    if (!fs.existsSync(templatesDir)) {
      await fs.promises.mkdir(templatesDir, { recursive: true })
    }

    // Find the template file for this node type
    const files = await fs.promises.readdir(templatesDir)
    let templateFile = ""

    for (const file of files) {
      if (file.endsWith(".json") && (file.includes(nodeType) || file.toLowerCase().includes(nodeType.toLowerCase()))) {
        templateFile = file
        break
      }
    }

    // If no existing file, create a new one
    if (!templateFile) {
      templateFile = `enhanced-${nodeType.toLowerCase()}-template.json`
    }

    const filePath = path.join(templatesDir, templateFile)

    // Read existing content or create new
    let content: Record<string, any> = {}
    if (fs.existsSync(filePath)) {
      content = JSON.parse(await fs.promises.readFile(filePath, "utf8"))
    }

    // Update the specific band
    content[bandId] = data

    // Write back to file
    await fs.promises.writeFile(filePath, JSON.stringify(content, null, 2))

    return NextResponse.json({ success: true, nodeType, bandId })
  } catch (error) {
    console.error("Error updating template:", error)
    return NextResponse.json({ error: "Failed to update template" }, { status: 500 })
  }
}