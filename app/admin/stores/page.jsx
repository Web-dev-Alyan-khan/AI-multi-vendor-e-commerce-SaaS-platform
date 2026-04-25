'use client'
import StoreInfo from "@/components/admin/StoreInfo"
import Loading from "@/components/Loading"
import { useAuth } from "@clerk/nextjs"
import axios from "axios"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"
import { motion } from "framer-motion"

export default function AdminStores() {
    const { getToken } = useAuth()
    const [stores, setStores] = useState([])
    const [loading, setLoading] = useState(true)

    const fetchStores = async () => {
        try {
            const token = await getToken()
            const { data } = await axios.get('/api/admin/stores', {
                headers: { Authorization: `Bearer ${token}` }
            })
            if (data.success) setStores(data.stores)
        } catch (error) {
            toast.error("Error loading stores")
        } finally {
            setLoading(false)
        }
    }

  const toggleIsActive = async (storeId) => {
    try {
        const token = await getToken();
        const { data } = await axios.post('/api/admin/toggle-store', 
            { storeId },
            { headers: { Authorization: `Bearer ${token}` } }
        );
        
        if (data.success) {
            toast.success(data.message);
            // Access isActive from the nested store object returned by your backend
            setStores(prev => prev.map(s => 
                s.id === storeId ? { ...s, isActive: data.store.isActive } : s
            ));
        }
    } catch (error) {
        toast.error("Failed to update status");
        throw error; 
    }
}

    useEffect(() => { fetchStores() }, [])

    if (loading) return <Loading />

    return (
        <div className="p-4 md:p-10 bg-[#f8fafc] min-h-screen">
            <div className="max-w-5xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
                        Live <span className="text-blue-600 font-medium">Vendors</span>
                    </h1>
                    <p className="text-slate-500 mt-1">Monitor and manage active stores on the platform.</p>
                </div>

                {stores.length > 0 ? (
                    <div className="flex flex-col gap-5">
                        {stores.map((store) => (
                            <motion.div 
                                layout
                                key={store.id} 
                                className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 flex flex-col md:flex-row gap-6 md:items-center justify-between hover:border-blue-100 transition-all"
                            >
                                <StoreInfo store={store} />

                                <div className="flex items-center gap-4 bg-slate-50 px-5 py-3 rounded-xl border border-slate-100">
                                    <span className={`text-sm font-bold ${store.isActive ? 'text-emerald-600' : 'text-slate-400'}`}>
                                        {store.isActive ? 'ONLINE' : 'OFFLINE'}
                                    </span>
                                    
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input 
                                            type="checkbox" 
                                            className="sr-only peer" 
                                            onChange={() => toast.promise(toggleIsActive(store.id), { 
                                                loading: "Syncing...",
                                                success: "Updated",
                                                error: "Failed"
                                            })} 
                                            checked={store.isActive} 
                                        />
                                        <div className="w-11 h-6 bg-slate-300 rounded-full peer peer-checked:bg-blue-600 transition-all duration-300"></div>
                                        <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-all duration-300 peer-checked:translate-x-5 shadow-sm"></div>
                                    </label>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center h-80 bg-white rounded-[2.5rem] border-2 border-dashed border-slate-200">
                        <h1 className="text-xl text-slate-400 font-medium">No live stores found</h1>
                    </div>
                )}
            </div>
        </div>
    )
}