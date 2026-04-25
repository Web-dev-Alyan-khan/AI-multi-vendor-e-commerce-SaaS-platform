'use client'
import { useUser, UserButton } from "@clerk/nextjs";
import Link from "next/link";

const AdminNavbar = () => {
  const { user, isLoaded } = useUser();

  return (
    <div className="flex items-center justify-between px-12 py-3 border-b border-slate-200">
      
      {/* Logo */}
      <Link href="/" className="relative text-4xl font-semibold text-slate-700">
        <span className="text-green-600">go</span>cart
        <span className="text-green-600 text-5xl">.</span>

        {/* Admin badge */}
        <span className="absolute text-xs font-semibold -top-2 -right-10 px-2 py-0.5 rounded-full text-white bg-green-500">
          Admin
        </span>
      </Link>

      {/* User */}
      <div className="flex items-center gap-3">
        <p>
          Hi,{" "}
          {isLoaded ? (user?.firstName || "Admin") : "Loading..."}
        </p>
        <UserButton afterSignOutUrl="/" />
      </div>
    </div>
  );
};

export default AdminNavbar;