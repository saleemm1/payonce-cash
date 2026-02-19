import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();

    
    const headers = {
      "Content-Type": "application/json",
    };

    if (process.env.PINATA_JWT) {
      headers["Authorization"] = `Bearer ${process.env.PINATA_JWT}`;
    } else {
      headers["pinata_api_key"] = process.env.PINATA_API_KEY;
      headers["pinata_secret_api_key"] = process.env.PINATA_SECRET_API_KEY;
    }

    const res = await fetch("https://api.pinata.cloud/pinning/pinJSONToIPFS", {
      method: "POST",
      headers: headers,
      body: JSON.stringify({
        pinataContent: body,
        pinataOptions: { cidVersion: 1 }
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error("Pinata Upload Error:", errText);
      throw new Error("Failed to upload to Pinata: " + errText);
    }

    const data = await res.json();
    return NextResponse.json({ cid: data.IpfsHash });
    
  } catch (error) {
    console.error("Server API Error:", error);
    return NextResponse.json({ error: "IPFS Upload Error" }, { status: 500 });
  }
}
