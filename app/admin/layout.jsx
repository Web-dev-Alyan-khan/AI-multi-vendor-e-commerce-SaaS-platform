import AdminLayout from "@/components/admin/AdminLayout";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export const metadata = {
  title: "GoCart - Admin",
  description: "Admin Dashboard",
};

export default async function RootAdminLayout({ children }) {
  // Use auth() for server-side protection
  const { userId } = await auth();

  // If the user is not logged in, redirect them to the sign-in page
  // You can point this to your custom sign-in page
  if (!userId) {
    redirect("/sign-in?redirect_url=/admin");
  }

  // If logged in, render the AdminLayout
  return (
    <AdminLayout>
      {children}
    </AdminLayout>
  );
}