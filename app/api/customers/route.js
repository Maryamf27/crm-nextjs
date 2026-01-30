import connectDB from "@/lib/mongodb";
import Customer from "@/models/Customer";
import { NextResponse } from "next/server";

export async function GET() {
  await connectDB();
  const customers = await Customer.find({}).sort({ createdAt: -1 });
  return NextResponse.json(customers);
}

export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();
    const newCustomer = await Customer.create(body);
    return NextResponse.json(newCustomer, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create" }, { status: 500 });
  }
}