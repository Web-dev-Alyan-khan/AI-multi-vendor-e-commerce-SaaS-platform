'use client'
import { PackageIcon, Search, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useUser, useClerk, UserButton } from "@clerk/nextjs";

const Navbar = () => {
    const router = useRouter();
    const { user } = useUser();
    const { openSignIn } = useClerk(); // Hook to trigger login modal

    const [search, setSearch] = useState('');
    // Ensure your redux state path is correct (e.g., state.cart.total)
    const cartCount = useSelector((state) => state.cart?.total || 0);

    const handleSearch = (e) => {
        e.preventDefault();
        if (search.trim()) {
            router.push(`/shop?search=${search}`);
        }
    };

    return (
        <nav className="relative bg-white">
            <div className="mx-6">
                <div className="flex items-center justify-between max-w-7xl mx-auto py-4 transition-all">

                    {/* Logo */}
                    <Link href="/" className="relative text-4xl font-semibold text-slate-700">
                        <span className="text-green-600">go</span>cart<span className="text-green-600 text-5xl leading-0">.</span>
                        <p className="absolute text-xs font-semibold -top-1 -right-8 px-3 p-0.5 rounded-full flex items-center gap-2 text-white bg-green-500">
                            plus
                        </p>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden sm:flex items-center gap-4 lg:gap-8 text-slate-600">
                        <Link href="/" className="hover:text-green-600 transition">Home</Link>
                        <Link href="/shop" className="hover:text-green-600 transition">Shop</Link>
                        <Link href="/" className="hover:text-green-600 transition">About</Link>
                        <Link href="/" className="hover:text-green-600 transition">Contact</Link>

                        {/* Search Bar */}
                        <form onSubmit={handleSearch} className="hidden xl:flex items-center w-xs text-sm gap-2 bg-slate-100 px-4 py-3 rounded-full">
                            <Search size={18} className="text-slate-600" />
                            <input 
                                className="w-full bg-transparent outline-none placeholder-slate-600" 
                                type="text" 
                                placeholder="Search products" 
                                value={search} 
                                onChange={(e) => setSearch(e.target.value)} 
                                required 
                            />
                        </form>

                        {/* Cart Link */}
                        <Link href="/cart" className="relative flex items-center gap-2 text-slate-600 hover:text-green-600 transition">
                            <ShoppingCart size={18} />
                            Cart
                            <span className="absolute -top-1 left-3 text-[10px] flex items-center justify-center text-white bg-slate-600 size-4 rounded-full">
                                {cartCount}
                            </span>
                        </Link>

                        {/* Auth Logic */}
                        {!user ? (
                            <button 
                                onClick={() => openSignIn()}
                                className="px-8 py-2 bg-indigo-500 hover:bg-indigo-600 transition text-white rounded-full"
                            >
                                Login
                            </button>
                        ) : (
                            <UserButton afterSignOutUrl="/">
                                <UserButton.MenuItems>
                                    <UserButton.Action 
                                        label="My Orders" 
                                        labelIcon={<PackageIcon size={16} />} 
                                        onClick={() => router.push('/orders')} 
                                    />
                                    <UserButton.Action 
                                        label="Cart" 
                                        labelIcon={<ShoppingCart size={16} />} 
                                        onClick={() => router.push('/cart')} 
                                    />
                                </UserButton.MenuItems>
                            </UserButton>
                        )}
                    </div>

                    {/* Mobile User Section */}
                    <div className="sm:hidden flex items-center gap-4">
                        {!user ? (
                            <button 
                                onClick={() => openSignIn()}
                                className="px-7 py-1.5 bg-indigo-500 hover:bg-indigo-600 text-sm transition text-white rounded-full"
                            >
                                Login
                            </button>
                        ) : (
                            <UserButton afterSignOutUrl="/" />
                        )}
                    </div>
                </div>
            </div>
            <hr className="border-gray-200" />
        </nav>
    );
};

export default Navbar;