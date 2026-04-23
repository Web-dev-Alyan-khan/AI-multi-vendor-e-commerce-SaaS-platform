import { prisma } from "@/prisma/db";
import { inngest } from "./client";

/**
 * ✅ USER CREATED
 */
export const syncUserCreation = inngest.createFunction(
  { 
    id: "sync-user-creation", 
    retries: 2,
    triggers: [{ event: "clerk/user.created" }] // Triggers go INSIDE the first object
  },
  async ({ event, step }) => { // Handler is the SECOND argument
    const { id, first_name, last_name, email_addresses, image_url } = event.data;
    
    const email = email_addresses?.[0]?.email_address;
    const fullName = `${first_name ?? ""} ${last_name ?? ""}`.trim() || "New User";

    await step.run("save-user-to-db", async () => {
      return await prisma.user.upsert({
        where: { id },
        update: {
          name: fullName,
          email: email,
          image: image_url ?? "",
        },
        create: {
          id,
          name: fullName,
          email: email,
          image: image_url ?? "",
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
    id: "sync-user-updation", 
    retries: 2,
    triggers: [{ event: "clerk/user.updated" }] 
  },
  async ({ event, step }) => {
    const { id, first_name, last_name, email_addresses, image_url } = event.data;
    
    const email = email_addresses?.[0]?.email_address;
    const fullName = `${first_name ?? ""} ${last_name ?? ""}`.trim();

    await step.run("update-user-in-db", async () => {
      return await prisma.user.update({
        where: { id },
        data: {
          ...(fullName && { name: fullName }),
          ...(email && { email }),
          ...(image_url && { image: image_url }),
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
    id: "sync-user-deletion", 
    retries: 1,
    triggers: [{ event: "clerk/user.deleted" }] 
  },
  async ({ event, step }) => {
    const { id } = event.data;

    await step.run("delete-user-from-db", async () => {
      if (!id) return;
      return await prisma.user.delete({
        where: { id },
      }).catch(() => null);
    });

    return { success: true };
  }
);