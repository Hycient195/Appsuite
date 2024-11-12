export interface ILoggedInUser {
  id: string;
  email: string;
  verified_email: boolean;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
}

export interface ICreateFileRequest { appName: string, fileName: string, content: string, mimeType: string }

export interface IUpdateFileRequest {
  fileId: string;
  content: string;
  mimeType: string;
  updateType: ("autosave"|"versionedSave")
}

export interface IFileVersions {
  id: string;
  keepForever: boolean;
  modifiedTime: string;
}

export type TMimeTypes = "text/csv"

export interface IUploadFileRequest {
  fileId: string;
  content: Blob|File
}

export interface IRenameFolderAndPrimaryFileRequest { folderId: string, primaryFileMimeType: TMimeTypes, newFileName: string}

// type TModules = [ "FINANCE_TRACKER", "INVOICE_GENERATOR" ]
// export type TModules =  ("FINANCE_TRACKER"|"INVOICE_GENERATOR" )

// export interface IUserModel {
//   id: string;
//   email: string;
//   verified_email: boolean;
//   name: string;
//   given_name: string;
//   family_name: string;
//   picture: string;
//   modules: {
//     [key in TModules]: {
//       preferences: {

//       }
//     }
//   }
// }