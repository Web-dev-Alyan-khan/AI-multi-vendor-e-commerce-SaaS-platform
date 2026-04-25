'use client'
import StoreInfo from "@/components/admin/StoreInfo"
import Loading from "@/components/Loading"
import { useAuth, useUser } from "@clerk/nextjs"
import axios from "axios"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"
import { motion, AnimatePresence } from "framer-motion"
import { CheckCircle, XCircle, Inbox, Store as StoreIcon } from "lucide-react"

export default function AdminApprove() {
    const { user } = useUser()
    const { getToken } = useAuth()
    const [stores, setStores] = useState([])
    const [loading, setLoading] = useState(true)

    const fetchStores = async () => {
        try {
            const token = await getToken()
            const { data } = await axios.get('/api/admin/approve-store', {
                headers: { Authorization: `Bearer ${token}` }
            })
            if (data.success) setStores(data.stores)
        } catch (error) {
            toast.error("Failed to fetch stores")
        } finally {
            setLoading(false)
        }
    }

    const handleApprove = async (storeId, status) => {
        try {
            const token = await getToken()
            const { data } = await axios.post('/api/admin/approve-store', 
                { storeId, status },
                { headers: { Authorization: `Bearer ${token}` } }
            )
            toast.success(data.message)
            fetchStores() // Refresh list
        } catch (error) {
            toast.error("Operation failed")
        }
    }

    useEffect(() => {
        if (user) fetchStores()
    }, [user])

    if (loading) return <Loading />

    return (
        <div className="p-4 md:p-10 bg-[#f8fafc] min-h-screen">
            <div className="max-w-5xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
                        Vendor <span className="text-blue-600 font-medium">Approvals</span>
                    </h1>
                    <p className="text-slate-500 mt-1">Review and manage new store applications for GoCart.</p>
                </div>

                <AnimatePresence mode="popLayout">
                    {stores.length > 0 ? (
                        <div className="grid gap-6">
                            {stores.map((store) => (
                                <motion.div 
                                    layout
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    key={store.id} 
                                    className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 group hover:border-blue-200 transition-all"
                                >
                                    <div className="flex-1">
                                        <StoreInfo store={store} />
                                    </div>

                                    <div className="flex gap-3 w-full md:w-auto border-t md:border-none pt-4 md:pt-0">
                                        <button 
                                            onClick={() => handleApprove(store.id, 'approved')} 
                                            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2.5 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition-all active:scale-95 text-sm"
                                        >
                                            <CheckCircle size={18} /> Approve
                                        </button>
                                        <button 
                                            onClick={() => handleApprove(store.id, 'rejected')} 
                                            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2.5 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-red-50 hover:text-red-600 transition-all active:scale-95 text-sm"
                                        >
                                            <XCircle size={18} /> Reject
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    ) : (
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex flex-col items-center justify-center h-[60vh] text-center bg-white border-2 border-dashed border-slate-200 rounded-[2.5rem]"
                        >
                            <div className="p-6 bg-slate-50 rounded-full mb-4">
                                <Inbox size={48} className="text-slate-300" />
                            </div>
                            <h2 className="text-2xl font-bold text-slate-800">All caught up!</h2>
                            <p className="text-slate-400 max-w-xs mt-2">No new store applications are currently pending your review.</p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    )
}