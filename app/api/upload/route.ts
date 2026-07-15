import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { v4 as uuidv4 } from "uuid";

const ALLOWED_EXTENSIONS = [".png", ".jpg", ".jpeg", ".gif", ".pdf", ".doc", ".docx", ".xls", ".xlsx", ".txt"];
const ALLOWED_MIME_TYPES = [
    "image/png",
    "image/jpeg",
    "image/gif",
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "text/plain"
];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return NextResponse.json({ error: "No file provided" }, { status: 400 });
        }

        // Validate file size
        if (file.size > MAX_FILE_SIZE) {
            return NextResponse.json({ error: "File too large. Maximum size is 10MB" }, { status: 400 });
        }

        const fileName = file.name;
        const fileExtension = path.extname(fileName).toLowerCase();

        // Validate file extension and MIME type
        if (!ALLOWED_EXTENSIONS.includes(fileExtension) || !ALLOWED_MIME_TYPES.includes(file.type)) {
            return NextResponse.json({ error: "Invalid file type. Only images, PDFs, text, and document files are allowed." }, { status: 400 });
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        const uniqueFileName = `${uuidv4()}${fileExtension}`;
        
        // Define upload directory
        const uploadDir = path.join(process.cwd(), "public", "uploads", "pengaduan");
        
        // Ensure directory exists
        try {
            await mkdir(uploadDir, { recursive: true });
        } catch {
            // Directory might already exist
        }

        const filePath = path.join(uploadDir, uniqueFileName);
        await writeFile(filePath, buffer);

        const publicPath = `/uploads/pengaduan/${uniqueFileName}`;

        return NextResponse.json({ 
            success: true, 
            path: publicPath,
            name: fileName,
            type: file.type
        });
    } catch (error) {
        console.error("Upload error:", error);
        return NextResponse.json({ error: "Upload failed" }, { status: 500 });
    }
}
