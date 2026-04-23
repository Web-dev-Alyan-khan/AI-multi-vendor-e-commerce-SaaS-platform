import { prisma } from "@/prisma/db";
import { inngest } from "./client";

/**
 * ✅ USER CREATED
 */
export const syncUserCreation = inngest.createFunction(
  {
    id: "user-created",
    retries: 2, // ✅ v4 feature (important)
  },
  { event: "user.created" },
  async ({ event, step }) => {
    const { id, name, email, image } = event.data;

    await step.run("create-user-in-db", async () => {
      await prisma.user.upsert({
        where: { id },
        update: {},
        create: {
          id,
          name,
          email,
          image: image ?? "",
          cart: {},
        },
      });
    });

    return { success: true };
  }
);

/**
 * ✅ USER UPDATED
 */
export const syncUserUpdation = inngest.createFunction(
  {
    id: "user-updated",
    retries: 2,
  },
  { event: "user.updated" },
  async ({ event, step }) => {
    const { id, name, email, image } = event.data;

    await step.run("update-user-in-db", async () => {
      await prisma.user.update({
        where: { id },
        data: {
          ...(name && { name }),
          ...(email && { email }),
          ...(image && { image }),
        },
      });
    });

    return { success: true };
  }
);

/**
 * ✅ USER DELETED
 */
export const syncUserDeletion = inngest.createFunction(
  {
    id: "user-deleted",
    retries: 1,
  },
  { event: "user.deleted" },
  async ({ event, step }) => {
    const { id } = event.data;

    await step.run("delete-user-from-db", async () => {
      await prisma.user.delete({
        where: { id },
      }).catch(() => null); // ✅ safe delete
    });

    return { success: true };
  }
);