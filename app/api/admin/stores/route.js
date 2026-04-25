import { prisma } from "@/lib/db";
import authAdmin from "@/middleware/authAdmin";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

//  Get all approved stores
export async function GET(request) {
  try {
    const { userId } = getAuth(request);

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const isAdmin = await authAdmin(userId);

    if (!isAdmin) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    const stores = await prisma.store.findMany({
      where: {
        status: {
          in: ["approved"], // ✅ must be array
        },
      },
      include: {
        user: true,
      },
    });

    return NextResponse.json({
      success: true,
      stores,
    });

  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}