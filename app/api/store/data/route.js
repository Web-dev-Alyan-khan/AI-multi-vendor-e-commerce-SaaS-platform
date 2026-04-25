import { prisma } from "@/lib/db";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);

    let username = searchParams.get("username");

    if (!username) {
      return Response.json(
        { error: "Username is required" },
        { status: 400 }
      );
    }

    username = username.toLowerCase();

    // ✅ get store
    const store = await prisma.store.findUnique({
      where: { username },
      include: {
        Product: {
          where: { inStock: true },
          include: {
            rating: true,
          },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    // ✅ check store existence
    if (!store || !store.isActive) {
      return Response.json(
        { error: "Store not found or inactive" },
        { status: 404 }
      );
    }

    return Response.json({
      success: true,
      store,
    });

  } catch (error) {
    console.error(error);
    return Response.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}