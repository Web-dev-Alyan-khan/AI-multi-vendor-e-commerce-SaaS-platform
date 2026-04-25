import authAdmin from "@/middleware/authAdmin";
import { getAuth } from "@clerk/nextjs/server";

//  auth admin API
export async function GET(request) {
  try {
    const { userId } = getAuth(request);

    if (!userId) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const isAdmin = await authAdmin(userId);

    if (!isAdmin) {
      return Response.json({ error: "Access denied" }, { status: 403 });
    }

    return Response.json({
      success: true,
      message: "Admin verified",
    });

  } catch (error) {
    console.error(error);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}