import { prisma } from "@/lib/db";
import authAdmin from "@/middleware/authAdmin";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const { userId } = getAuth(request);

    // 1. Security Check
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const isAdmin = await authAdmin(userId);
    if (!isAdmin) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    // 2. Optimized Data Fetching (Parallel)
    const [ordersCount, storesCount, productsCount, revenueData, allOrders] = await Promise.all([
      prisma.order.count(),
      prisma.store.count(),
      prisma.product.count(),
      prisma.order.aggregate({
        _sum: { total: true },
      }),
      prisma.order.findMany({
        select: {
          createdAt: true,
          total: true,
        },
        orderBy: {
          createdAt: 'asc',
        },
      }),
    ]);

    // 3. Formatted Response
    return NextResponse.json({
      success: true,
      dashboardData: {
        products: productsCount,
        revenue: Number(revenueData._sum.total?.toFixed(2)) || 0,
        orders: ordersCount,
        stores: storesCount,
        allOrders, // Passed to Area Chart
      },
    });

  } catch (error) {
    console.error("DASHBOARD_API_ERROR:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}