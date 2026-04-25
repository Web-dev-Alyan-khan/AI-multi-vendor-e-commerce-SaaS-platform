import { prisma } from "@/lib/db";
import authSeller from "@/middleware/authSeller";
import { getAuth } from "@clerk/nextjs/server";

export async function POST(request) {
  try {
    const { userId } = getAuth(request);

    if (!userId) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { productId } = await request.json();

    if (!productId) {
      return Response.json({ error: "Product ID required" }, { status: 400 });
    }

    // ✅ check seller
    let storeId;
    try {
      storeId = await authSeller(userId);
    } catch (err) {
      return Response.json({ error: err.message }, { status: 403 });
    }

    // ✅ check product
    const product = await prisma.product.findFirst({
      where: {
        id: productId,
        storeId,
      },
    });

    if (!product) {
      return Response.json({ error: "Product not found" }, { status: 404 });
    }

    // ✅ toggle stock
    const updatedProduct = await prisma.product.update({
      where: { id: productId },
      data: {
        inStock: !product.inStock,
      },
    });

    return Response.json({
      success: true,
      product: updatedProduct,
      message: "Stock status updated",
    });

  } catch (error) {
    console.error(error);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}