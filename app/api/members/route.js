import connectDB from "@/lib/mongodb";
import Member from "@/models/Member";
import { NextResponse } from "next/server";

export async function GET() {
  await connectDB();
  const members = await Member.find({});
  return NextResponse.json(members);
}

export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();
    const newMember = await Member.create(body);
    return NextResponse.json(newMember, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create member" }, { status: 500 });
  }
}