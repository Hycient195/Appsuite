"use server";

import { ICreateFileRequest, IUploadFileRequest } from '@/types/shared.types';
import { google } from 'googleapis';
import { cookies } from 'next/headers';


const APP_SUITE_FOLDER_NAME = "APPSUITE_APPS";

const auth = new google.auth.OAuth2({
  apiKey: process?.env?.NEXT_PUBLIC_GOOGLE_API_KEY,
});

async function getDriveService() {
  const cookieStore = (await cookies());
  const accessToken = cookieStore.get("asAccessToken")?.value;
  auth.setCredentials({ access_token: accessToken });
  return google.drive({ version: "v3", auth });
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

// Create or find the specific folder for a file, storing primary, versions, and recovery files
export async function getOrCreateFileFolder(appName: string, fileName: string) {
  const appFolderId = await initializeFolders(appName);
  if (!appFolderId) throw new Error(`Folder for ${appName} not found`);

  // Create a folder named after the file, which will contain the file and its backups
  return getOrCreateFolder(fileName, appFolderId);
}

// CRUD Operations for files
export async function createFileInFolder({ appName, fileName, content, mimeType }: ICreateFileRequest) {
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

import { Readable } from "stream"

/**
 * Saves a content file in the same folder as the specified file ID.
 * @param fileId - ID of the existing file to get the parent folder from.
 * @param content - The file content to upload as Blob or File.
 * @returns The URL of the uploaded file with view permissions for everyone.
 */
export async function saveFileInFileFolder({ fileId, content }: IUploadFileRequest): Promise<string | null> {
  console.log(fileId)
  const driveService = await getDriveService();
  
  try {
    // Retrieve file metadata to find its direct parent folder
    const fileMetadata = await driveService.files.get({
      fileId,
      fields: 'parents',
    });

    const parentFolderId = fileMetadata.data.parents?.[0];
    if (!parentFolderId) {
      throw new Error(`Parent folder for file ID ${fileId} not found`);
    }

    const fileBuffer = content.stream();

    // Upload the new file to the identified parent folder
    const fileResponse = await driveService.files.create({
      requestBody: {
        name: `Uploaded File - ${Date.now()}`,  // Customize file name as needed
        parents: [parentFolderId],
      },
      media: {
        mimeType: content.type,
        body: Readable.from(fileBuffer as any),
      },
      fields: 'id, webViewLink',
      supportsAllDrives: true,
    });

    const newFileId = fileResponse.data.id;
    if (!newFileId) {
      throw new Error("Failed to create the file in the parent folder");
    }

    // Update permissions to allow public view access
    await driveService.permissions.create({
      fileId: newFileId,
      requestBody: {
        role: 'reader',
        type: 'anyone',
      },
    });

    return fileResponse.data.webViewLink || null;
  } catch (error) {
    console.error("Error saving file in file folder:", error);
    return null;
  }
}