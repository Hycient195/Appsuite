"use server";

import { google } from 'googleapis';
import { cookies } from 'next/headers';
import { ICreateFileRequest, IRenameFolderAndPrimaryFileRequest, IUploadFileRequest, TMimeTypes } from '@/types/shared.types';


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

export async function readFile(fileId: string) {
  const driveService = await getDriveService();

  // Get file metadata including name
  const fileMetadata = await driveService.files.get({
    fileId,
    fields: "name, parents",
  });

  // Get file content
  const response = await driveService.files.get({
    fileId,
    alt: "media",
  });

  return {
    fileId,
    fileName: fileMetadata.data.name,
    folderId: fileMetadata.data.parents ? fileMetadata.data.parents[0] : null,
    content: response.data,
  };
}

export async function updateFile (fileId: string, content: string, mimeType: string, updateType: ("autosave"|"versionedSave")) {
  const driveService = await getDriveService();
  const response = await driveService.files.update({
    fileId,
    media: {
      mimeType: mimeType,
      body: content,
    },
    keepRevisionForever: updateType === "versionedSave",
    fields: "modifiedTime, name, mimeType", // Request additional fields
  });

  return {
    fileId,
    name: response.data.name, // File name
    mimeType: response.data.mimeType, // MIME type
    modifiedTime: response.data.modifiedTime, // Last modified timestamp
    updateType,
  };
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

import { Readable } from "stream";

/**
 * Saves a content file in the same folder as the specified file ID.
 * @param fileId - ID of the existing file to get the parent folder from.
 * @param content - The file content to upload as Blob or File.
 * @returns The URL of the uploaded file with view permissions for everyone.
 */
export async function saveFileInFileFolder({ fileId, content }: IUploadFileRequest): Promise<{ id: string|null, url: string|null}> {
  const driveService = await getDriveService();
  
  try {
    if (!fileId || !content) throw new Error("No file id or content");
    // Retrieve file metadata to find its direct parent folder
    const fileMetadata = await driveService.files.get({
      fileId,
      fields: 'parents',
    });

    const parentFolderId = fileMetadata.data.parents?.[0];
    if (!parentFolderId) {
      throw new Error(`Parent folder for file ID ${fileId} not found`);
    }

    const fileBuffer = content?.stream();

    // Upload the new file to the identified parent folder
    const fileResponse = await driveService.files.create({
      requestBody: {
        name: `${content?.name?.split(".")[0]??"Uploaded File"} - ${Date.now()}`,  // Customize file name as needed
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
    
    return { id: fileResponse.data.id || null,  url: fileResponse.data.webViewLink || null };
  } catch (error) {
    console.error("Error saving file in file folder:", error);
    throw new Error(`Unble to create file: ${error}`)
    // return { id: null, url: null };
  }
}

/**
 * Renames a folder and its primary file with the specified MIME type.
 * @param folderId - The ID of the folder to rename.
 * @param primaryFileMimeType - The MIME type of the primary file to rename.
 * @param newFileName - The new name for the folder and primary file.
 * @returns A result object indicating success or failure.
 */
export async function renameFolderAndPrimaryFile({
  folderId,
  primaryFileMimeType,
  newFileName
}: IRenameFolderAndPrimaryFileRequest): Promise<{ success: boolean; folderNameUpdated?: boolean; primaryFileNameUpdated?: boolean; error?: string }> {
  const driveService = await getDriveService();
  
  try {
    // Step 1: Rename the folder with the new file name
    await driveService.files.update({
      fileId: folderId,
      requestBody: { name: newFileName },
    });

    // Step 2: Find the primary file with the specified MIME type in the folder
    const fileResponse = await driveService.files.list({
      q: `'${folderId}' in parents and mimeType='${primaryFileMimeType}'`,
      fields: 'files(id, name)',
      pageSize: 1, // Retrieve only the first matching file
    });

    const primaryFile = fileResponse.data.files?.[0];
    if (!primaryFile) {
      throw new Error(`Primary file with MIME type ${primaryFileMimeType} not found in folder ${folderId}`);
    }

    // Step 3: Rename the primary file with the new file name
    await driveService.files.update({
      fileId: primaryFile.id || undefined,
      requestBody: { name: newFileName },
    });

    return {
      success: true,
      folderNameUpdated: true,
      primaryFileNameUpdated: true,
    };
  } catch (error) {
    console.error("Error renaming folder and primary file:", error);
    return {
      success: false,
      error: "Failed to rename folder and primary file. " + (error as Error).message,
    };
  }
}

/**
 * Retrieves all subfolders within the specified AppSuite application folder,
 * along with the primary file in each subfolder matching the specified MIME type.
 *
 * @param folderName - Name of the application folder in AppSuite (e.g., "RECEIPT_TRACKER").
 * @param primaryFileMimeType - MIME type of the primary file to find in each subfolder.
 * @returns An array of objects, each containing the subfolder properties and primary file properties.
 */
export async function getFoldersWithPrimaryFile(folderName: string, primaryFileMimeType: TMimeTypes) {
  const driveService = await getDriveService();

  try {
    // Step 1: Find the AppSuite Apps root folder
    const appSuiteFolderId = await getOrCreateFolder(APP_SUITE_FOLDER_NAME);
    if (!appSuiteFolderId) throw new Error("AppSuite root folder not found.");

    // Step 2: Find the application folder (e.g., "RECEIPT_TRACKER") within the AppSuite root folder
    const appFolderId = await getOrCreateFolder(folderName, appSuiteFolderId);
    if (!appFolderId) throw new Error(`Folder '${folderName}' not found in AppSuite.`);

    // Step 3: Get all subfolders within the application folder
    const subfoldersResponse = await driveService.files.list({
      q: `'${appFolderId}' in parents and mimeType='application/vnd.google-apps.folder'`,
      fields: 'files(id, name)',
    });

    const subfolders = subfoldersResponse.data.files || [];

    // Step 4: Retrieve the primary file in each subfolder based on the specified MIME type
    const foldersWithPrimaryFile = await Promise.all(
      subfolders.map(async (subfolder) => {
        const primaryFileResponse = await driveService.files.list({
          q: `'${subfolder.id}' in parents and mimeType='${primaryFileMimeType}'`,
          fields: 'files(id, name, mimeType, size)',
          pageSize: 1, // Get only the first matching file
        });

        const primaryFile = primaryFileResponse.data.files?.[0] || null;

        return {
          folderId: subfolder.id,
          folderName: subfolder.name,
          primaryFile: primaryFile
          ? {
              fileId: primaryFile.id,
              fileName: primaryFile.name,
              mimeType: primaryFile.mimeType,
              size: primaryFile.size,
            }
          : null,
        };
      })
    );

    return foldersWithPrimaryFile;
  } catch (error) {
    console.error("Error retrieving folders with primary files:", error);
    throw new Error("Failed to retrieve folders with primary files.");
  }
}

/** Corrent Implementation of method below, but wring usecase */
// /**
//  * Fetches folders with a specified name and their primary file based on MIME type.
//  * @param folderName - The name of the folder to search for.
//  * @param primaryFileMimeType - The MIME type of the primary file in each subfolder.
//  * @returns An array of objects with each containing folder and primary file details.
//  */
// export async function getFoldersWithPrimaryFile(
//   folderName: string,
//   primaryFileMimeType: TMimeTypes
// ): Promise<Array<{ folderId: string; folderName: string; primaryFile?: { id: string; name: string } }> | null> {
//   const driveService = await getDriveService();

//   try {
//     // Step 1: Search for all folders with the specified folder name
//     const folderResponse = await driveService.files.list({
//       q: `name='${folderName}' and mimeType='application/vnd.google-apps.folder'`,
//       fields: 'files(id, name)',
//     });

//     const folders = folderResponse.data.files;
//     if (!folders || folders.length === 0) {
//       throw new Error(`No folders found with the name ${folderName}`);
//     }

//     // Step 2: Iterate through each folder and find the primary file with the specified MIME type
//     const foldersWithPrimaryFiles = await Promise.all(
//       folders.map(async (folder) => {
//         // Fetch the primary file in the current folder based on MIME type
//         const primaryFileResponse = await driveService.files.list({
//           q: `'${folder.id}' in parents and mimeType='${primaryFileMimeType}'`,
//           fields: 'files(id, name)',
//           pageSize: 1, // Retrieve only the first matching file
//         });

//         const primaryFile = primaryFileResponse.data.files?.[0];

//         return {
//           folderId: folder.id,
//           folderName: folder.name,
//           primaryFile: primaryFile
//             ? { id: primaryFile.id, name: primaryFile.name }
//             : undefined,
//         };
//       })
//     );

//     return foldersWithPrimaryFiles as unknown as ReturnType<typeof getFoldersWithPrimaryFile>;
//   } catch (error) {
//     console.error("Error fetching folders and primary files:", error);
//     return null;
//   }
// }

/**
 * Deletes a folder and all its contents (files and subfolders) recursively.
 * @param folderId - The ID of the folder to delete.
 */
export async function deleteFolderAllFilesInFolder(folderId: string): Promise<{ success: boolean; error?: string }> {
  const driveService = await getDriveService();

  try {
    // Step 1: List all files and folders within the specified folder
    const listFilesAndFolders = async (parentId: string) => {
      return await driveService.files.list({
        q: `'${parentId}' in parents`,
        fields: 'files(id, name, mimeType)',
      });
    };

    // Step 2: Recursively delete all files and subfolders
    const deleteRecursively = async (parentId: string) => {
      const response = await listFilesAndFolders(parentId);
      const items = response.data.files;

      if (items) {
        for (const item of items) {
          if (item.mimeType === 'application/vnd.google-apps.folder') {
            // If the item is a folder, delete its contents recursively
            await deleteRecursively(item.id as string);
          }
          // Delete the file or folder
          await driveService.files.delete({ fileId: item.id as string });
        }
      }
    };

    // Start recursive deletion with the specified folder
    await deleteRecursively(folderId);

    // Step 3: Delete the root folder itself
    await driveService.files.delete({ fileId: folderId });

    return { success: true };
  } catch (error) {
    console.error("Error deleting folder and its contents:", error);
    return { success: false, error: `Failed to delete folder: ${error}` };
  }
}