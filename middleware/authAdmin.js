import { clerkClient } from "@clerk/nextjs/server";

const authAdmin = async (userId) => {
  try {
    if (!userId) return false;

    // FIX: You must await clerkClient() before accessing .users
    const client = await clerkClient(); 
    const user = await client.users.getUser(userId);

    const adminEmails = process.env.ADMIN_EMAIL?.split(",") || [];

    const userEmail = user.emailAddresses?.[0]?.emailAddress;

    if (!userEmail) return false;

    return adminEmails.includes(userEmail);

  } catch (error) {
    console.error("Admin auth error:", error);
    return false;
  }
};

export default authAdmin;