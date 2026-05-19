import { NextResponse } from "next/server";
import { generateOrderNumber } from "@/lib/utils";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      customerName,
      phone,
      email,
      deliveryAddress,
      paymentMethod,
      notes,
      items,
      subtotal,
    } = body;

    // Validate required fields
    if (!customerName || !phone || !deliveryAddress || !items?.length) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Generate order number
    const orderNumber = generateOrderNumber();

    // In a real implementation, this would insert into Supabase
    // For now, return a mock response
    const order = {
      id: Date.now().toString(),
      orderNumber,
      customerName,
      phone,
      email,
      deliveryAddress,
      paymentMethod,
      notes,
      status: "pending",
      subtotal,
      deliveryFee: 0,
      total: subtotal,
      createdAt: new Date().toISOString(),
      items,
    };

    return NextResponse.json({ success: true, order }, { status: 201 });
  } catch (error) {
    console.error("Order creation error:", error);
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");

    // In a real implementation, this would query Supabase
    // For now, return mock data
    return NextResponse.json({ orders: [], success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}