// backend/services/fileProcessingService.js
import mammoth from "mammoth";
import { PDFExtract } from "pdf.js-extract"; // new
import fs from "fs";
import fsPromises from "fs/promises";

// Keep: extractTextFromFile entry
async function extractTextFromFile(fileBuffer, mimetype) {
  try {
    if (mimetype === "application/pdf") {
      return await extractPdfTextFromBuffer(fileBuffer);
    } else if (
      mimetype ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      const result = await mammoth.extractRawText({ arrayBuffer: fileBuffer });
      return result.value;
    } else if (mimetype === "text/plain" || mimetype === "text/markdown") {
      return Buffer.isBuffer(fileBuffer)
        ? fileBuffer.toString("utf8")
        : Buffer.from(fileBuffer).toString("utf8");
    } else {
      throw new Error("Unsupported file type.");
    }
  } catch (error) {
    console.error("Error extracting text from file:", error);
    throw new Error("Failed to extract text from the provided file.");
  }
}

// New: pure-JS PDF extraction without pdftk
async function extractPdfTextFromBuffer(fileBuffer) {
  const pdfExtract = new PDFExtract();
  const options = {}; // defaults are fine
  // pdf.js-extract supports Buffer directly via extractBuffer
  const data = await pdfExtract.extractBuffer(fileBuffer, options);
  // Flatten all text items per page into a single string
  const pagesText = data.pages
    .map((p) => p.content.map((i) => i.str).join(" "))
    .join("\n");
  return pagesText;
}

export { extractTextFromFile };
