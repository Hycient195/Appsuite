import { getAllFilesInFolder, initializeFolders } from '@/services/googleDriveService';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const folderName = searchParams.get('folderName');
  const folderId = await initializeFolders(folderName as string)
  if (!folderId) return NextResponse.json({ error: 'folderId is required' }, { status: 400 });
  const response = await getAllFilesInFolder(folderId);
  return NextResponse.json(response);
}