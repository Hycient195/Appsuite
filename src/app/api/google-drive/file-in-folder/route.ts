import { createFileInFolder, getFoldersWithPrimaryFile, renameFolderAndPrimaryFile, saveFileInFileFolder } from "@/services/googleDriveService";
import { ICreateFileRequest, IRenameFolderAndPrimaryFileRequest, IUploadFileRequest, TMimeTypes } from "@/types/shared.types";
import { NextResponse } from "next/server";

/** Get all folders in a folder with their primary file */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const folderName = searchParams.get('folderName');
  const primaryFileMimeType = searchParams.get('primaryFileMimeType') as TMimeTypes;
  if (!folderName) return NextResponse.json({ error: 'folderName is required' }, { status: 400 });
  const response = await getFoldersWithPrimaryFile(folderName, primaryFileMimeType);
  return NextResponse.json(response);
}

/** Creates a file in a specified folder */
export async function POST(request: Request) {
  const req = await request.json() as ICreateFileRequest;
  const response = await createFileInFolder(req);
  return NextResponse.json(response); 
}

/** Renames folder and primary file specified with the primary file mimeType */
export async function PATCH(request: Request) {
  const req = await request.json() as IRenameFolderAndPrimaryFileRequest;
  const response = await renameFolderAndPrimaryFile(req);
  return NextResponse.json(response);
}

/** Saves a file in a specified folder */
export async function PUT(request: Request) {
  const req = await request.formData();
  const theContent = req.get("content");
  const theFileId = req.get("fileId");
  const response = await saveFileInFileFolder({ fileId: theFileId as any, content: theContent as any});
  return NextResponse.json(response);
}
