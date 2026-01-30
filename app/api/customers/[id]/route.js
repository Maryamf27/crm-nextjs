import connectDB from '@/lib/mongodb';
import Customer from '@/models/Customer';
import { NextResponse } from 'next/server';

// DELETE A CUSTOMER
export async function DELETE(req, { params }) {
  try {
    await connectDB();
    
    // Remember to await params for Next.js 15!
    const resolvedParams = await params;
    const id = resolvedParams.id;

    // This is the line that actually talks to MongoDB
    const deleted = await Customer.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json({ error: "Customer not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Deleted successfully" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}

// UPDATE A CUSTOMER
export async function PUT(req, { params }) {
    try {
        await connectDB();

        // FIXED: You must await params in Next.js 15
        const resolvedParams = await params;
        const id = resolvedParams.id;

        const body = await req.json();

        const updatedCustomer = await Customer.findByIdAndUpdate(
            id,
            { $set: body },
            { new: true }
        );

        if (!updatedCustomer) {
            return NextResponse.json({ error: "Customer not found" }, { status: 404 });
        }

        return NextResponse.json(updatedCustomer, { status: 200 });
    } catch (error) {
        console.error("Update Error:", error);
        return NextResponse.json({ error: "Failed to update" }, { status: 500 });
    }
}