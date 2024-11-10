import { createFile, readFile, updateFile, deleteFile } from "@/services/googleDriveService";
import { ICreateFileRequest } from "@/types/shared.types";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const req = await request.json() as ICreateFileRequest;
  const response = await createFile(req);
  return NextResponse.json(response);
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const fileId = searchParams.get('fileId');
  if (!fileId) return NextResponse.json({ error: 'fileId is required' }, { status: 400 });
  const response = await readFile(fileId);
  return NextResponse.json(response);
}

export async function PATCH(request: Request) {
  const { fileId, content, mimeType, updateType } = await request.json();
  if (!fileId || !content) return NextResponse.json({ error: 'fileId and content are required' }, { status: 400 });
  const response = await updateFile(fileId, content, mimeType, updateType);
  return NextResponse.json(response);
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const fileId = searchParams.get('fileId');
  if (!fileId) return NextResponse.json({ error: 'fileId is required' }, { status: 400 });
  const response = await deleteFile(fileId);
  return NextResponse.json(response);
}
