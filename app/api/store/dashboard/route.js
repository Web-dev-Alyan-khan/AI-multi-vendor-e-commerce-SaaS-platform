import { prisma } from "@/lib/db";
import authSeller from "@/middleware/authSeller";
import { getAuth } from "@clerk/nextjs/server";

export async function GET(request) {
  try {
    const { userId } = getAuth(request);

    if (!userId) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    //  check seller
    let storeId;
    try {
      storeId = await authSeller(userId);
    } catch (err) {
      return Response.json({ error: err.message }, { status: 403 });
    }

    //  orders
    const orders = await prisma.order.findMany({
      where: { storeId },
    });

    //  products
    const products = await prisma.product.findMany({
      where: { storeId },
    });

    //  ratings
    const ratings = await prisma.rating.findMany({
      where: {
        productId: {
          in: products.map((p) => p.id),
        },
      },
      include: {
        user: true,
        product: true,
      },
    });

    //  earnings
    const totalEarnings = Math.round(
      orders.reduce((acc, order) => acc + order.total, 0)
    );

    const dashboardData = {
      totalOrders: orders.length,
      totalProducts: products.length,
      totalEarnings,
      ratings,
    };

    return Response.json({
      success: true,
      dashboard: dashboardData,
    });

  } catch (error) {
    console.error(error);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}