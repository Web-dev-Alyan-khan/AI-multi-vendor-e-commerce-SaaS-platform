import { prisma } from "@/lib/db";
import authAdmin from "@/middleware/authAdmin";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// ✅ Add New Coupon
export async function POST(request) {
    try {
        const { userId } = getAuth(request);
        if (!userId || !(await authAdmin(userId))) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
        }

        const { coupon } = await request.json();

        if (!coupon.code || !coupon.discount) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // Fix: Added parentheses to toUpperCase()
        const code = coupon.code.toUpperCase();

        const newCoupon = await prisma.coupon.create({
            data: {
                ...coupon,
                code: code
            }
        });

        return NextResponse.json({ success: true, message: "Coupon created", coupon: newCoupon });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to create coupon. Code might already exist." }, { status: 500 });
    }
}

//  Delete Coupon
export async function DELETE(request) {
    try {
        const { userId } = getAuth(request);
        if (!userId || !(await authAdmin(userId))) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
        }

        const { searchParams } = new URL(request.url);
        const code = searchParams.get('code');

        if (!code) {
            return NextResponse.json({ error: "Coupon code required" }, { status: 400 });
        }

        // Use deleteMany to avoid P2025 errors if the record is missing
        const result = await prisma.coupon.deleteMany({
            where: { 
                code: code.toUpperCase() 
            }
        });

        if (result.count === 0) {
            return NextResponse.json({ 
                success: false, 
                message: "Coupon not found or already deleted" 
            }, { status: 404 });
        }

        return NextResponse.json({ 
            success: true, 
            message: "Coupon deleted successfully" 
        });

    } catch (error) {
        console.error("DELETE_COUPON_ERROR:", error);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}

//  Get all Coupons
export async function GET(request) {
    try {
        const { userId } = getAuth(request);
        if (!userId || !(await authAdmin(userId))) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
        }

        const coupons = await prisma.coupon.findMany({
            orderBy: { createdAt: 'desc' }
        });

        return NextResponse.json({ success: true, coupons });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}