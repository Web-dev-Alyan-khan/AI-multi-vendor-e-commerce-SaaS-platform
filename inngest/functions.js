import { prisma } from "@/lib/db";
import { inngest } from "./client";



//Inngest Founction to save user data to a database
export const syncUserCreation = inngest.createFunction(
  {
    id: "user-create",
    triggers: [{ event: "clerk/user.created" }],
  },
  async ({ event }) => {
    const user = event.data;

    await prisma.user.upsert({
      where: { id: user.id },
      update: {
        name: `${user.first_name || ""} ${user.last_name || ""}`.trim(),
        email: user.email_addresses?.[0]?.email_address || "",
        image: user.image_url || "",
      },
      create: {
        id: user.id,
        name: `${user.first_name || ""} ${user.last_name || ""}`.trim(),
        email: user.email_addresses?.[0]?.email_address || "",
        image: user.image_url || "",
        cart: {},
      },
    });

    return { ok: true };
  }
);
//Inngest Founction to update user data to a database
export const syncUserUpdation = inngest.createFunction(
  {
    id: "user-update",
    triggers: [{ event: "clerk/user.updated" }],
  },
  async ({ event }) => {
    const user = event.data;

    await prisma.user.update({
      where: { id: user.id },
      data: {
        name: `${user.first_name || ""} ${user.last_name || ""}`.trim(),
        email: user.email_addresses?.[0]?.email_address || "",
        image: user.image_url || "",
      },
    });

    return { ok: true };
  }
);
//Inngest Founction to delete user  to a database
export const syncUserDeletion = inngest.createFunction(
  {
    id: "user-delete",
    triggers: [{ event: "clerk/user.deleted" }],
  },
  async ({ event }) => {
    const user = event.data;

    await prisma.user.delete({
      where: { id: user.id },
    });

    return { ok: true };
  }
);

//Inngest Founction to delete coupon on expiry
export const deleteCouponOnExpiry = inngest.createFunction(
  { id: "delete-coupon-on-expiry", name: "Auto Delete Coupon" },
  { event: "app/coupon.created" }, // Triggers when you call inngest.send in your Coupon POST route
  async ({ event, step }) => {
    const { couponId, expiresAt } = event.data;

    // Wait until the specific date/time
    await step.sleepUntil("wait-for-expiry", expiresAt);

    // Delete the coupon
    await step.run("delete-coupon-db", async () => {
      return await prisma.coupon.deleteMany({
        where: { id: couponId },
      });
    });

    return { success: true };
  }
);