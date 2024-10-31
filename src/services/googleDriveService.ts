"use server";

import { ICreateFileRequest } from '@/types/shared.types';
import { google } from 'googleapis';
import { cookies } from 'next/headers';


const APP_SUITE_FOLDER_NAME = "AppSuite";

const auth = new google.auth.OAuth2({
  apiKey: process?.env?.NEXT_PUBLIC_GOOGLE_API_KEY,
});

async function getDriveService() {
  const accessToken = (await cookies()).get("asAccessToken")?.value;
  auth.setCredentials({ access_token: accessToken });
  return google.drive({ version: "v3", auth});
}

// Create or find the AppSuite folder
export async function getOrCreateFolder (name: string, parentId?: string): Promise<string | null | undefined> {
  const driveService = await getDriveService();
  if (!driveService) return null;

  const query = `'${parentId || 'root'}' in parents and name='${name}' and mimeType='application/vnd.google-apps.folder'`;
  const response = await driveService.files.list({ q: query });
  const folder = response.data.files?.[0];

  if (folder) return folder.id;

  const folderResponse = await driveService.files.create({
    requestBody: {
      name,
      mimeType: 'application/vnd.google-apps.folder',
      parents: parentId ? [parentId] : ['root'],
    },
    fields: 'id',
  });
  return folderResponse.data.id || null;
};

// Initialize AppSuite and app folders
export async function initializeFolders (appName: string) {
  const appSuiteFolderId = await getOrCreateFolder(APP_SUITE_FOLDER_NAME);
  if (!appSuiteFolderId) throw new Error("Failed to create AppSuite folder");
  return getOrCreateFolder(appName, appSuiteFolderId);
};

// CRUD Operations for files
export async function createFile ({appName, fileName, content, mimeType}: ICreateFileRequest) {
  const driveService = await getDriveService();
  const appFolder = await initializeFolders(appName);
  const folderId = appFolder;
  if (!folderId) throw new Error(`Folder for ${appName} not found`);

  return driveService.files.create({
    requestBody: {
      name: fileName,
      parents: [folderId],
      mimeType,
    },
    media: {
      mimeType,
      body: content,
    },
  });
};

export async function readFile (fileId: string) {
  const driveService = await getDriveService();
  const response = await driveService.files.get({
    fileId,
    alt: 'media',
  });
  return response.data;
};

export async function updateFile (fileId: string, content: string) {
  const driveService = await getDriveService();
  return driveService.files.update({
    fileId,
    media: {
      mimeType: 'text/plain',
      body: content,
    },
  });
};

export async function deleteFile (fileId: string) {
  const driveService = await getDriveService();
  return driveService.files.delete({ fileId });
};

// Get all files in a folder
export async function getAllFilesInFolder (folderId: string) {
  const driveService = await getDriveService();
  const response = await driveService.files.list({
    q: `'${folderId}' in parents`,
    fields: 'files(id, name, mimeType, size)',
  });
  return response.data.files;
};