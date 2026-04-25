import { prisma } from "@/lib/db";
import authSeller from "@/middleware/authSeller";
import { getAuth } from "@clerk/nextjs/server";

export async function GET(request) {
  try {
    const { userId } = getAuth(request);

    if (!userId) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    let storeId;

    // ✅ check seller
    try {
      storeId = await authSeller(userId);
    } catch (err) {
      return Response.json({
        isSeller: false,
        message: err.message,
      });
    }

    // ✅ get store info
    const storeInfo = await prisma.store.findUnique({
      where: { userId },
    });

    return Response.json({
      isSeller: true,
      store: storeInfo,
    });

  } catch (error) {
    console.error(error);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}