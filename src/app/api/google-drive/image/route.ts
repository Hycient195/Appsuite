// import type { NextApiRequest, NextApiResponse } from 'next';

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   const { imageUrl } = req.query;

//   if (!imageUrl) {
//     res.status(400).json({ error: 'Image URL is required' });
//     return;
//   }

//   try {
//     const response = await fetch(imageUrl as string);

//     if (!response.ok) {
//       res.status(response.status).end();
//       return;
//     }

//     const imageBuffer = await response.arrayBuffer();
//     res.setHeader('Content-Type', response.headers.get('Content-Type') || 'image/jpeg');
//     res.send(Buffer.from(imageBuffer));
//   } catch (error) {
//     res.status(500).json({ error: 'Failed to fetch image' });
//   }
// }

import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const imageUrl = searchParams.get('imageUrl');

  console.log(imageUrl)

  if (!imageUrl) {
    return NextResponse.json({ error: 'Image URL is required' }, { status: 400 });
  }

  try {
    const response = await fetch(imageUrl);

    // if (!response.ok) {
    //   return NextResponse.error(response.statusText, { status: response.status });
    // }

    const imageBuffer = await response.arrayBuffer();
    return new NextResponse(Buffer.from(imageBuffer), {
      headers: {
        'Content-Type': response.headers.get('Content-Type') || 'image/jpeg',
      },
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch image' }, { status: 500 });
  }
}