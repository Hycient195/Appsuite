"use server";

import { ICreateFileRequest, TMimeTypes } from '@/types/shared.types';
import { getNewAccessToken } from '@/utils/getRefreshToken';
import { google } from 'googleapis';
import { cookies } from 'next/headers';
import nookies, { setCookie } from 'nookies';


const APP_SUITE_FOLDER_NAME = "APPSUITE_APPS";

const auth = new google.auth.OAuth2({
  apiKey: process?.env?.NEXT_PUBLIC_GOOGLE_API_KEY,
});

async function getDriveService() {
  const cookieStore = (await cookies());
  const accessToken = cookieStore.get("asAccessToken")?.value;
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

export async function updateFile (fileId: string, content: string, mimeType: string, updateType: ("autosave"|"versionedSave")) {
  const driveService = await getDriveService();
  return driveService.files.update({
    fileId,
    media: {
      mimeType: mimeType,
      body: content,
    },
    keepRevisionForever: (updateType === "versionedSave") ? true : false
  });
};

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

export async function listFileVersions(fileId: string) {
  const driveService = await getDriveService();
  const response = await driveService.revisions.list({
    fileId,
    fields: 'revisions(id, modifiedTime, keepForever)',
  });
  return response.data.revisions;
}

export async function restoreFileVersion(fileId: string, revisionId: string, mimeType: string) {
  const driveService = await getDriveService();
  const revision = await driveService.revisions.get({
    fileId,
    revisionId,
    alt: 'media',
  });

  // Re-update the file with the old revision content to restore it
  return driveService.files.update({
    fileId,
    media: {
      // mimeType: 'application/vnd.google-apps.document',
      mimeType: mimeType,
      body: revision.data,
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