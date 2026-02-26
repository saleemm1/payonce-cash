import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic'; 

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const address = searchParams.get('address');

  if (!address) return NextResponse.json({ error: 'No address' }, { status: 400 });

  try {
    const res1 = await fetch(`https://bch.cryptoservers.net/api/v2/address/${address}`, {
        headers: { 'User-Agent': 'Mozilla/5.0' },
        next: { revalidate: 0 }
    });
    if (res1.ok) return NextResponse.json(await res1.json());

    const res2 = await fetch(`https://bch1.trezor.io/api/v2/address/${address}`, {
        headers: { 'User-Agent': 'Mozilla/5.0' },
        next: { revalidate: 0 }
    });
    if (res2.ok) return NextResponse.json(await res2.json());

    return NextResponse.json({ error: 'Nodes down' }, { status: 500 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
