import { prisma } from "@/lib/db";

const authSeller = async (userId) => {
  try {
    if (!userId) throw new Error("Unauthorized");

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { store: true },
    });

    if (!user || !user.store) {
      throw new Error("No store found");
    }

    if (user.store.status !== "approved") {
      throw new Error("Store not approved");
    }

    return user.store.id;

  } catch (error) {
    throw new Error(error.message);
  }
};

export default authSeller;