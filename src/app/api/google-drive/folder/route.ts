// import { getAllFilesInFolder, initializeFolders, updateFileName } from '@/services/googleDriveService';
import { initializeFolders, getAllFilesInFolder, updateFileName, deleteFolderAllFilesInFolder } from '@/services/googleDriveService';
import { get, request } from 'http';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const folderName = searchParams.get('folderName');
  const folderId = await initializeFolders(folderName as string)
  if (!folderId) return NextResponse.json({ error: 'folderId is required' }, { status: 400 });
  const response = await getAllFilesInFolder(folderId);
  return NextResponse.json(response);
}

/* Update File Name */
export async function POST(request: NextRequest) {
  const { fileId, fileName } = await request.json();

  if (!fileId || !fileName) {
    return NextResponse.json(
      { success: false, error: "fileId and fileName are required" },
      { status: 400 }
    );
  }
  const result = await updateFileName(fileId, fileName);
  if (result.success) {
    return NextResponse.json({ success: true, data: result.data });
  } else {
    return NextResponse.json({ success: false, error: result.error }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const folderId = searchParams.get('folderId');
  if (!folderId) return NextResponse.json({ error: 'folderId is required' }, { status: 400 });
  const response = await deleteFolderAllFilesInFolder(folderId);
  return NextResponse.json(response);
}