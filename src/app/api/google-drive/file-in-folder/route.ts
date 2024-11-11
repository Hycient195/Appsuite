import { createFileInFolder, saveFileInFileFolder } from "@/services/googleDriveService";
import { ICreateFileRequest, IUploadFileRequest } from "@/types/shared.types";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const req = await request.json() as ICreateFileRequest;
  const response = await createFileInFolder(req);
  return NextResponse.json(response);
}

export async function PATCH(request: Request) {
  const req = await request.formData();
  const theContent = req.get("content");
  const theFileId = req.get("fileId");
  const response = await saveFileInFileFolder({ fileId: theFileId as any, content: theContent as any});
  return NextResponse.json(response);
}