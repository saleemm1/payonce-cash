import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();

    const res = await fetch("https://api.pinata.cloud/pinning/pinJSONToIPFS", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        pinata_api_key: process.env.PINATA_API_KEY,
        pinata_secret_api_key: process.env.PINATA_SECRET_API_KEY,
      },
      body: JSON.stringify({
        pinataContent: body,
        pinataOptions: { cidVersion: 1 }
      }),
    });

    if (!res.ok) {
      throw new Error("Failed to upload to Pinata");
    }

    const data = await res.json();
    
    return NextResponse.json({ cid: data.IpfsHash });
  } catch (error) {
    return NextResponse.json({ error: "IPFS Upload Error" }, { status: 500 });
  }
}
