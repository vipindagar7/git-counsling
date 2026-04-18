import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { StudentCounsiling } from '@/lib/models';

export async function POST(request) {
  try {
    const { name, contact, altContact, fatherName, fatherContact, program, permanant_address, counslerName, entranceTest } = await request.json();

    if (!name || !contact || !fatherName || !fatherContact || !program || !permanant_address || !counslerName || !entranceTest) {
      return NextResponse.json(
        { success: false, message: 'All fields are required' },
        { status: 400 }
      );
    }

    await connectDB();

    const user = await StudentCounsiling.create({ name, contact, altContact, fatherName, fatherContact, program, permanant_address, counslerName, entranceTest });

    return NextResponse.json(
      { success: true, message: 'StudentCounsiling registered successfully', user },
      { status: 201 }
    );
  } catch (err) {
    if (err.code === 11000) {
      return NextResponse.json(
        { success: false, message: 'This contact number is already registered.' },
        { status: 409 }
      );
    }
    console.error('register error:', err);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}

// export async function GET() {
//   try {
//     await connectDB();
//     const users = await StudentCounsiling.find().sort({ createdAt: -1 });
//     return NextResponse.json({ success: true, users });
//   } catch (err) {
//     console.error('fetch users error:', err);
//     return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
//   }
// }