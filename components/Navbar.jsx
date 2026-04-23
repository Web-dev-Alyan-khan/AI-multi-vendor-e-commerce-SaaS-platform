'use client'
import { Menu, PackageIcon, Search, ShoppingCart, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useUser, useClerk, UserButton } from "@clerk/nextjs"

const Navbar = () => {
    const router = useRouter();
    const { user } = useUser();
    const { openSignIn } = useClerk();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [search, setSearch] = useState('');
    const cartCount = useSelector(state => state.cart.total);

    const handleSearch = (e) => {
        e.preventDefault();
        router.push(`/shop?search=${search}`);
        setIsMenuOpen(false); // Close menu on search
    }

    return (
        <nav className="relative bg-white border-b border-gray-200">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between py-4">
                    
                    {/* Logo */}
                    <Link href="/" className="relative text-3xl font-semibold text-slate-700">
                        <span className="text-green-600">go</span>cart<span className="text-green-600 text-5xl leading-0">.</span>
                        <p className="absolute text-[10px] font-semibold -top-1 -right-8 px-2 p-0.5 rounded-full flex items-center text-white bg-green-500">
                            plus
                        </p>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center gap-6 lg:gap-8 text-slate-600 font-medium">
                        <Link href="/" className="hover:text-green-600">Home</Link>
                        <Link href="/shop" className="hover:text-green-600">Shop</Link>
                        <Link href="/about" className="hover:text-green-600">About</Link>
                        <Link href="/contact" className="hover:text-green-600">Contact</Link>

                        <form onSubmit={handleSearch} className="hidden xl:flex items-center w-64 text-sm gap-2 bg-slate-100 px-4 py-2 rounded-full border border-transparent focus-within:border-green-400 transition-all">
                            <Search size={18} className="text-slate-500" />
                            <input 
                                className="w-full bg-transparent outline-none placeholder-slate-500" 
                                type="text" 
                                placeholder="Search products" 
                                value={search} 
                                onChange={(e) => setSearch(e.target.value)} 
                                required 
                            />
                        </form>

                        <Link href="/cart" className="relative flex items-center gap-2 text-slate-600 hover:text-green-600">
                            <ShoppingCart size={20} />
                            <span className="hidden lg:block">Cart</span>
                            <span className="absolute -top-2 -left-2 text-[10px] flex items-center justify-center text-white bg-green-600 size-4 rounded-full font-bold">
                                {cartCount}
                            </span>
                        </Link>

                        {!user ? (
                            <button className="px-6 py-2 bg-indigo-500 hover:bg-indigo-600 transition text-white rounded-full shadow-md" onClick={() => openSignIn()}>
                                Login
                            </button>
                        ) : (
                            <UserButton afterSignOutUrl="/">
                                <UserButton.MenuItems>
                                    <UserButton.Action labelIcon={<PackageIcon size={16}/>} label="My Orders" onClick={() => router.push('/orders')}/>
                                    <UserButton.Action labelIcon={<ShoppingCart size={16}/>} label="Cart" onClick={() => router.push('/cart')}/>
                                </UserButton.MenuItems>
                            </UserButton>
                        )}
                    </div>

                    {/* Mobile Controls (Search, Cart, Burger) */}
                    <div className="flex md:hidden items-center gap-4">
                        <Link href="/cart" className="relative text-slate-600">
                            <ShoppingCart size={24} />
                            <span className="absolute -top-2 -right-2 text-[10px] flex items-center justify-center text-white bg-green-600 size-4 rounded-full font-bold">
                                {cartCount}
                            </span>
                        </Link>
                        
                        {user ? (
                             <UserButton afterSignOutUrl="/" />
                        ) : (
                            <button onClick={() => openSignIn()} className="text-sm font-medium text-indigo-600">Login</button>
                        )}

                        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-slate-600 focus:outline-none">
                            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu Overlay */}
                {isMenuOpen && (
                    <div className="md:hidden pb-6 pt-2 animate-in fade-in slide-in-from-top-4 duration-300">
                        <div className="flex flex-col gap-4 font-medium text-slate-600">
                            <form onSubmit={handleSearch} className="flex items-center w-full text-sm gap-2 bg-slate-100 px-4 py-3 rounded-xl mb-2">
                                <Search size={18} className="text-slate-500" />
                                <input 
                                    className="w-full bg-transparent outline-none" 
                                    type="text" 
                                    placeholder="Search products..." 
                                    value={search} 
                                    onChange={(e) => setSearch(e.target.value)} 
                                />
                            </form>
                            <Link href="/" onClick={() => setIsMenuOpen(false)} className="py-2 border-b border-slate-50">Home</Link>
                            <Link href="/shop" onClick={() => setIsMenuOpen(false)} className="py-2 border-b border-slate-50">Shop</Link>
                            <Link href="/about" onClick={() => setIsMenuOpen(false)} className="py-2 border-b border-slate-50">About</Link>
                            <Link href="/contact" onClick={() => setIsMenuOpen(false)} className="py-2 border-b border-slate-50">Contact</Link>
                            <Link href="/orders" onClick={() => setIsMenuOpen(false)} className="py-2 border-b border-slate-50">My Orders</Link>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    )
}

export default Navbar;