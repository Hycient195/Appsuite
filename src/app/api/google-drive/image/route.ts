import { uploadImage } from "@/services/googleDriveService";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const req = await request.json() as { image: string, fileName: string};
  const response = await uploadImage(req.image, req.fileName);
  return NextResponse.json(response);
}