import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { id, wallet } = await req.json();

    const response = await fetch('https://rest.mainnet.cash/v1/token/mint', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        token_id: "789654...", 
        address: wallet,
        amount: "1"
      })
    });

    return NextResponse.json({ 
      success: true, 
      message: "CashToken Receipt Minted",
      txId: "mock-tx-id-for-demo"
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message });
  }
}