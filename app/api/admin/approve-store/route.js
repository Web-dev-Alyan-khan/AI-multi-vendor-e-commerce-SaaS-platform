import { prisma } from "@/lib/db";
import authAdmin from "@/middleware/authAdmin";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { userId } = getAuth(request);
    if (!userId || !(await authAdmin(userId))) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    const { storeId, status } = await request.json();

    if (!["approved", "rejected"].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const updatedStore = await prisma.store.update({
      where: { id: storeId },
      data: {
        status,
        isActive: status === "approved",
      },
    });

    return NextResponse.json({
      success: true,
      message: `Store ${status} successfully`,
    });
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function GET(request) {
  try {
    const { userId } = getAuth(request);
    if (!userId || !(await authAdmin(userId))) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    const stores = await prisma.store.findMany({
      where: { status: { in: ["pending", "rejected"] } },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, stores });
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}