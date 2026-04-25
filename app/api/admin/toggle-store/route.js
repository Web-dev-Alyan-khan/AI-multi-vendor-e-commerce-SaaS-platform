import { prisma } from "@/lib/db";
import authAdmin from "@/middleware/authAdmin";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// ✅ Toggle Store isActive
export async function POST(request) {
  try {
    const { userId } = getAuth(request);

    // 🔒 auth check
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const isAdmin = await authAdmin(userId);

    if (!isAdmin) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    // 📦 get data
    const { storeId } = await request.json();

    if (!storeId) {
      return NextResponse.json(
        { error: "storeId is required" },
        { status: 400 }
      );
    }

    // 🔍 find store
    const store = await prisma.store.findUnique({
      where: { id: storeId },
    });

    if (!store) {
      return NextResponse.json(
        { error: "Store not found" },
        { status: 404 }
      );
    }

    // 🔁 toggle active
    const updatedStore = await prisma.store.update({
      where: { id: storeId },
      data: {
        isActive: !store.isActive,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Store status updated",
      store: updatedStore,
    });

  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}