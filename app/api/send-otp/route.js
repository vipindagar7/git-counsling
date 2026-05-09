// app/api/send-otp/route.js

import { NextResponse } from "next/server";
import otpGenerator from "otp-generator";

import { connectDB } from "@/lib/db";
import { OTP } from "@/lib/models";

import { sendOTP } from "@/lib/sendOtp";
import { sendWhatsAppOTP } from "@/lib/sendWhatsAppOtp";

export async function POST(request) {
    try {
        const body = await request.json();

        console.log("BODY:", body);

        const { contact } = body;

        // Validate contact
        if (!contact || !/^\d{10}$/.test(contact)) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Valid 10-digit mobile number required",
                },
                { status: 400 }
            );
        }

        // Connect MongoDB
        await connectDB();

        // Generate OTP
        const otp = otpGenerator.generate(6, {
            digits: true,
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false,
        });

        // Expiry: 5 minutes
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

        // Remove old OTPs for this contact
        await OTP.deleteMany({ contact });

        // Save new OTP
        await OTP.create({
            contact,
            otp,
            expiresAt,
        });

        console.log("Generated OTP:", otp);

        // Send OTP
        try {
            await sendWhatsAppOTP(contact, otp);
            await sendOTP(contact, otp);
        } catch (smsError) {
            console.error("OTP SEND ERROR:", smsError);
        }

        return NextResponse.json({
            success: true,
            message: "OTP sent successfully",
        });
    } catch (err) {
        console.error("send-otp error:", err);

        return NextResponse.json(
            {
                success: false,
                message: "Server error",
            },
            { status: 500 }
        );
    }
}

export async function GET() {
    return NextResponse.json({
        ok: true,
        route: "working",
    });
}