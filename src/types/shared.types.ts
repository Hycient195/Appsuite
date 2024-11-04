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
}

// type TModules = [ "ACCOUNT_LEDGER", "INVOICE_GENERATOR" ]
// export type TModules =  ("ACCOUNT_LEDGER"|"INVOICE_GENERATOR" )

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