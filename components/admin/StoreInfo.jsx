'use client'
import Image from "next/image"
import { MapPin, Mail, Phone, User } from "lucide-react"

const StoreInfo = ({ store }) => {
    // 1. Safety check to ensure component doesn't render if store is missing
    if (!store) return null;

    // 2. Fallback values for images
    const storeLogo = store?.logo || "/default-store.png";
    const userImage = store?.user?.image || store?.user?.imageUrl || "/default-avatar.png";

    return (
        <div className="flex-1 space-y-2 text-sm">
            {/* Logo with Fallback */}
            <Image 
                width={100} 
                height={100} 
                src={storeLogo} 
                alt={store?.name || "Store Logo"} 
                className="max-w-20 max-h-20 object-contain shadow rounded-full max-sm:mx-auto bg-white" 
            />
            
            <div className="flex flex-col sm:flex-row gap-3 items-center">
                <h3 className="text-xl font-semibold text-slate-800"> {store?.name || "Unnamed Store"} </h3>
                <span className="text-sm text-slate-400">@{store?.username || "vendor"}</span>

                {/* Status Badge */}
                <span
                    className={`text-xs font-semibold px-4 py-1 rounded-full capitalize ${
                        store?.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : store?.status === 'rejected'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-green-100 text-green-800'
                    }`}
                >
                    {store?.status || 'Unknown'}
                </span>
            </div>

            <p className="text-slate-600 my-5 max-w-2xl">{store?.description || "No description provided."}</p>
            
            <div className="space-y-1 text-slate-500">
                <p className="flex items-center gap-2"> <MapPin size={16} /> {store?.address || "No address"}</p>
                <p className="flex items-center gap-2"><Phone size={16} /> {store?.contact || "No contact"}</p>
                <p className="flex items-center gap-2"><Mail size={16} /> {store?.email || "No email"}</p>
            </div>

            <p className="text-slate-700 mt-5 border-t pt-4">
                Applied on <span className="text-xs font-medium">{store?.createdAt ? new Date(store.createdAt).toLocaleDateString() : 'N/A'}</span> by
            </p>

            <div className="flex items-center gap-2 text-sm mt-2">
                {/* User Image with Optional Chaining */}
                <div className="relative w-9 h-9">
                    <Image 
                        fill
                        src={userImage} 
                        alt={store?.user?.name || "User"} 
                        className="rounded-full object-cover border border-slate-200" 
                    />
                </div>
                <div>
                    <p className="text-slate-600 font-medium">{store?.user?.name || "Unknown User"}</p>
                    <p className="text-slate-400 text-xs">{store?.user?.email || "No email"}</p>
                </div>
            </div>
        </div>
    )
}

export default StoreInfo