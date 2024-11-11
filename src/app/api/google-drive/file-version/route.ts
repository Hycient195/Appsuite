// pages/api/drive/listFileVersions.ts
import { listFileVersions, restoreFileVersion } from '@/services/googleDriveService';
// import type { NextApiRequest, NextApiResponse } from 'next';
import { NextResponse } from 'next/server';

type Data = {
  success: boolean;
  versions?: Array<{ id: string; modifiedTime: string; keepForever: boolean }>;
  error?: string;
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const fileId = searchParams.get('fileId');
  if (!fileId) return NextResponse.json({ error: 'fileId is required' }, { status: 400 });
  const response = await listFileVersions(fileId);
  return NextResponse.json(response);
}

export async function POST(request: Request) {
  const req = await request.json() as { fileId: string, revisionId: string, mimeType: string };
  const response = await restoreFileVersion(req.fileId, req.revisionId, req.mimeType);
  return NextResponse.json(response);
}
// export async function GET(req: NextApiRequest, res: NextApiResponse) {
//   // if (req.method !== 'GET') {
//   //   return res.status(405).json({ success: false, error: 'Method not allowed' });
//   // }

//   const { searchParams } = new URL(request.url);
//   const fileId = searchParams.get('fileId');
//   // if (!fileId) {
//   //   return res.status(400).json({ success: false, error: 'Missing fileId parameter' });
//   // }

//   try {
//     const versions = (await listFileVersions(fileId));
//     res.status(200).json({ success: true, versions });
//   } catch (error) {
//     console.error('Error listing file versions:', error);
//     res.status(500).json({ success: false, error: 'Failed to list file versions' });
//   }
// }


// export default async function POST(req: NextApiRequest, res: NextApiResponse) {
//   // if (req.method !== 'POST') {
//   //   return res.status(405).json({ success: false, error: 'Method not allowed' });
//   // }

//   const { fileId, revisionId } = req.body;
//   // if (!fileId || !revisionId) {
//   //   return res.status(400).json({ success: false, error: 'Missing fileId or revisionId parameter' });
//   // }

//   try {
//     const result = await restoreFileVersion(fileId, revisionId);
//     res.status(200).json({ success: true, data: result });
//   } catch (error) {
//     console.error('Error restoring file version:', error);
//     res.status(500).json({ success: false, error: 'Failed to restore file version' });
//   }
// }