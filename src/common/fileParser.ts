/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable @typescript-eslint/prefer-promise-reject-errors */
import * as fs from 'fs';
import * as path from 'path';
import * as pdfParse from 'pdf-parse';
import * as mammoth from 'mammoth';
import * as xlsx from 'xlsx';
import * as officeParser from 'officeparser';
import * as textract from 'textract';
import { createWorker } from 'tesseract.js';

export async function extractFileContent(filePath: string): Promise<string> {
  const ext = path.extname(filePath).toLowerCase();

  try {
    switch (ext) {
      case '.pdf':
        return await extractPdfContent(filePath);
      case '.docx':
        return await extractDocxContent(filePath);
      case '.xls':
      case '.xlsx':
        return await extractExcelContent(filePath);
      case '.ppt':
      case '.pptx':
        return await extractPptxContent(filePath);
      case '.txt':
      case '.md':
      case '.jsonl':
      case '.eml':
      case '.csv':
        return await extractTextContent(filePath);
      case '.jpg':
      case '.png':
      case '.jpeg':
        return await extractImageContent(filePath);
      default:
        throw new Error(`不支持的文件类型: ${ext}`);
    }
  } catch (error) {
    throw new Error(`文件解析失败: ${error.message}`);
  }
}

async function extractPdfContent(filePath: string): Promise<string> {
  const dataBuffer = fs.readFileSync(filePath);
  const data = await pdfParse(dataBuffer);
  return data.text;
}

async function extractDocxContent(filePath: string): Promise<string> {
  const result = await mammoth.extractRawText({ path: filePath });
  return result.value;
}

async function extractExcelContent(filePath: string): Promise<string> {
  const workbook = xlsx.readFile(filePath);
  let content = '';
  workbook.SheetNames.forEach((sheetName) => {
    const sheet = workbook.Sheets[sheetName];
    content += xlsx.utils.sheet_to_csv(sheet) + '\n';
  });
  return content;
}

async function extractPptxContent(filePath: string): Promise<string> {
  const content = await officeParser.parseOfficeAsync(filePath);
  return content;
}

async function extractTextContent(filePath: string): Promise<string> {
  return new Promise((resolve, reject) => {
    textract.fromFileWithPath(filePath, (error, text) => {
      if (error) {
        reject(error);
      } else {
        resolve(text);
      }
    });
  });
}
async function extractImageContent(filePath: string): Promise<string> {
  const worker: any = await createWorker();
  await worker.loadLanguage('eng+chi_sim');
  await worker.initialize('eng+chi_sim', {
    tessdata: '../packages/ocr',
  });
  const {
    data: { text },
  } = await worker.recognize(filePath);
  await worker.terminate();
  return text;
}
