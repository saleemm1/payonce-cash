import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const data = await req.formData();
    const file = data.get('file');

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const formData = new FormData();
    formData.append('file', file);

    const pinataRes = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.PINATA_JWT}`,
      },
      body: formData,
    });

    const json = await pinataRes.json();

    if (!pinataRes.ok) {
      throw new Error(json.error || "Pinata Error");
    }

    return NextResponse.json({ ipfsHash: json.IpfsHash });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
