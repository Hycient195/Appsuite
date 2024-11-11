"use server";

import { ICreateFileRequest } from '@/types/shared.types';
import { getNewAccessToken } from '@/utils/getRefreshToken';
import { google } from 'googleapis';
import { cookies } from 'next/headers';

const APP_SUITE_FOLDER_NAME = "APPSUITE_APPS";

const auth = new google.auth.OAuth2({
  apiKey: process?.env?.NEXT_PUBLIC_GOOGLE_API_KEY,
});

async function getDriveService() {
  const accessToken = (await cookies()).get("asAccessToken")?.value;
  auth.setCredentials({ access_token: accessToken });
  return google.drive({ version: "v3", auth });
}

// Helper to get or create a folder by name within a parent folder
export async function getOrCreateFolder(name: string, parentId?: string): Promise<string | null | undefined> {
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
}

// Initialize the AppSuite folder structure for each module
export async function initializeFolders(appName: string) {
  const appSuiteFolderId = await getOrCreateFolder(APP_SUITE_FOLDER_NAME);
  if (!appSuiteFolderId) throw new Error("Failed to create AppSuite folder");
  return getOrCreateFolder(appName, appSuiteFolderId);
}

// Create or find the specific folder for a file, storing primary, versions, and recovery files
export async function getOrCreateFileFolder(appName: string, fileName: string) {
  const appFolderId = await initializeFolders(appName);
  if (!appFolderId) throw new Error(`Folder for ${appName} not found`);

  // Create a folder named after the file, which will contain the file and its backups
  return getOrCreateFolder(fileName, appFolderId);
}

// CRUD Operations for files
export async function createFile({ appName, fileName, content, mimeType }: ICreateFileRequest) {
  const driveService = await getDriveService();
  const fileFolderId = await getOrCreateFileFolder(appName, fileName);
  if (!fileFolderId) throw new Error(`Folder for ${fileName} in ${appName} not found`);

  // Create the primary file with the same name as the folder
  return driveService.files.create({
    requestBody: {
      name: fileName,
      parents: [fileFolderId],
      mimeType,
    },
    media: {
      mimeType,
      body: content,
    },
  });
}

// Create a versioned backup file with a timestamp
export async function createVersionedFile(appName: string, fileName: string, content: string, mimeType: string) {
  const driveService = await getDriveService();
  const fileFolderId = await getOrCreateFileFolder(appName, fileName);
  if (!fileFolderId) throw new Error(`Folder for ${fileName} in ${appName} not found`);

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const versionedFileName = `${fileName}-${timestamp}.csv`;

  return driveService.files.create({
    requestBody: {
      name: versionedFileName,
      parents: [fileFolderId],
      mimeType,
    },
    media: {
      mimeType,
      body: content,
    },
  });
}

// Create a temporary recovery file (overwrites each time)
export async function createTemporaryRecoveryFile(appName: string, fileName: string, content: string, mimeType: string) {
  const driveService = await getDriveService();
  const fileFolderId = await getOrCreateFileFolder(appName, fileName);
  if (!fileFolderId) throw new Error(`Folder for ${fileName} in ${appName} not found`);

  const tempFileName = `${fileName}-temporary-recovery.csv`;

  // Search for existing temporary recovery file to overwrite
  const existingFiles = await driveService.files.list({
    q: `'${fileFolderId}' in parents and name='${tempFileName}'`,
    fields: 'files(id, name)',
  });
  const existingFileId = existingFiles.data.files?.[0]?.id;

  if (existingFileId) {
    // Update the existing recovery file
    return driveService.files.update({
      fileId: existingFileId,
      media: {
        mimeType,
        body: content,
      },
    });
  } else {
    // Create a new temporary recovery file
    return driveService.files.create({
      requestBody: {
        name: tempFileName,
        parents: [fileFolderId],
        mimeType,
      },
      media: {
        mimeType,
        body: content,
      },
    });
  }
}

// Retrieve a file's content
export async function readFile(fileId: string) {
  const driveService = await getDriveService();
  const response = await driveService.files.get({
    fileId,
    alt: 'media',
  });
  // response.data.parents
  return response.data;
}

// Update the primary file content
export async function updateFile(fileId: string, content: string, mimeType: string) {
  const driveService = await getDriveService();
  return driveService.files.update({
    fileId,
    media: {
      mimeType: mimeType,
      body: content,
    },
  });
}

// Update the primary file name
export async function updateFileName(fileId: string, fileName: string) {
  const driveService = await getDriveService();
  try {
    const response = await driveService.files.update({
      fileId,
      requestBody: {
        name: fileName,
      },
    });
    return { success: true, data: response.data };
  } catch (error) {
    console.error("Error updating file name:", error);
    return { success: false, error: "Failed to update file name" };
  }
}

// Delete a file or backup file
export async function deleteFile(fileId: string) {
  const driveService = await getDriveService();
  return driveService.files.delete({ fileId });
}

// Get all files in a specific folder (primary, versions, and recovery files)
export async function getAllFilesInFolder(folderId: string) {
  const driveService = await getDriveService();
  const response = await driveService.files.list({
    q: `'${folderId}' in parents`,
    fields: 'files(id, name, mimeType, size)',
  });
  return response.data.files;
}

export async function createTemporaryFile (folderId: string, content: string, mimeType: string) {
  const driveService = await getDriveService();

  // Create a temporary file
  const tempFileName = `file-temp.csv`;

  return driveService.files.create({
    requestBody: {
      name: tempFileName,
      parents: [folderId],
      mimeType,
    },
    media: {
      mimeType,
      body: content,
    },
  });
}

export async function uploadImage(image: any, fileName: string) {
  const driveService = await getDriveService();
  const rootFolderId = (await getOrCreateFolder(APP_SUITE_FOLDER_NAME));
  if (!rootFolderId) return;
  const financeTrackerFolderId = await getOrCreateFolder('FINANCE_TRACKER', rootFolderId);
  if (!financeTrackerFolderId) return;
  const imagesFolderId = await getOrCreateFolder('images', financeTrackerFolderId);
  if (!imagesFolderId) return;

  // Decode the image data (assuming base64 encoding)
  const buffer = Buffer.from(image, 'base64');

  // Upload the image
  return await driveService.files.create({
    requestBody: {
      name: fileName,
      parents: [imagesFolderId],
    },
    media: {
      mimeType: 'image/jpeg', // Change this as necessary
      body: buffer,
    },
    fields: 'id, webViewLink',
  });
}