import { NextResponse } from "next/server";
import puppeteer from "puppeteer";

// <style>${styles}</style> <!-- Inject Tailwind styles -->

export async function POST(req: Request) {
  try {
    const { html } = await req.json();
    
    if (!html) {
      return NextResponse.json({ message: "No HTML content provided" }, { status: 400 });
    }
    // console.log(html)
    // Inject TailwindCSS styles into the HTML
    const fullHTML = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Export PDF</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <style>.noExport {display:none !important;}</style>
      </head>
      <body>${html}</body>
      </html>
    `;

    // Launch Puppeteer
    const browser = await puppeteer.launch({
      headless: "shell",
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();
    await page.setContent(fullHTML, { waitUntil: "domcontentloaded" });

    // Generate the PDF
    const pdfBuffer = await page.pdf({
      format: "A3",
      printBackground: true,
    });

    await browser.close();

    // Return the PDF response
    return new Response(pdfBuffer, {
      headers: {
        "Content-Disposition": "attachment; filename=export.pdf",
        "Content-Type": "application/pdf",
      },
    });
  } catch (error) {
    console.error("PDF Generation Error:", error);
    return NextResponse.json({ message: "Error generating PDF" }, { status: 500 });
  }
}




// import { NextResponse } from "next/server";
// import puppeteer from "puppeteer";

// // POST request handler
// export async function POST(req: Request) {
//   try {
//     const { html } = await req.json();

//     if (!html) {
//       return NextResponse.json({ message: "No HTML content provided" }, { status: 400 });
//     }

//     // Launch Puppeteer in a serverless-compatible way
//     const browser = await puppeteer.launch({
//       headless: "shell", // Runs in headless mode
//       args: ["--no-sandbox", "--disable-setuid-sandbox"],
//     });

//     const page = await browser.newPage();
//     await page.setContent(html, { waitUntil: "domcontentloaded" });

//     // Generate the PDF
//     const pdfBuffer = await page.pdf({
//       format: "A4",
//       printBackground: true,
//     });

//     await browser.close();

//     // Return the PDF response
//     return new Response(pdfBuffer, {
//       headers: {
//         "Content-Disposition": "attachment; filename=export.pdf",
//         "Content-Type": "application/pdf",
//       },
//     });
//   } catch (error) {
//     console.error("PDF Generation Error:", error);
//     return NextResponse.json({ message: "Error generating PDF" }, { status: 500 });
//   }
// }





// import { NextApiRequest, NextApiResponse } from "next";
// import puppeteer from "puppeteer";

// export default async function handler(
//   req: NextApiRequest,
//   res: NextApiResponse
// ) {
//   if (req.method !== "POST") {
//     return res.status(405).json({ message: "Method Not Allowed" });
//   }

//   try {
//     const { html } = req.body;
//     if (!html) {
//       return res.status(400).json({ message: "No HTML content provided" });
//     }

//     // Launch Puppeteer in a serverless-compatible way
//     const browser = await puppeteer.launch({
//       // headless: "new", // Use "new" for modern headless mode
//       headless: true,
//       args: ["--no-sandbox", "--disable-setuid-sandbox"],
//     });

//     const page = await browser.newPage();
//     await page.setContent(html, { waitUntil: "domcontentloaded" });

//     // Generate the PDF
//     const pdfBuffer = await page.pdf({
//       format: "A4",
//       printBackground: true,
//     });

//     await browser.close();

//     // Set headers for download
//     res.setHeader("Content-Disposition", "attachment; filename=export.pdf");
//     res.setHeader("Content-Type", "application/pdf");
//     res.status(200).send(pdfBuffer);
//   } catch (error) {
//     console.error("PDF Generation Error:", error);
//     res.status(500).json({ message: "Error generating PDF" });
//   }
// }