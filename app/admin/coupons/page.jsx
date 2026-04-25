'use client'
import { useEffect, useState } from "react"
import { format } from "date-fns"
import toast from "react-hot-toast"
import { Trash2 } from "lucide-react" // Using Trash2 for a cleaner look
import { useAuth } from "@clerk/nextjs"
import axios from "axios"

export default function AdminCoupons() {
    const { getToken } = useAuth()
    const [coupons, setCoupons] = useState([])
    const [newCoupon, setNewCoupon] = useState({
        code: '',
        description: '',
        discount: '',
        forNewUser: false,
        forMember: false,
        isPublic: false,
        expiresAt: format(new Date(), 'yyyy-MM-dd') // Store as string for input compatibility
    })

    const fetchCoupons = async () => {
        try {
            const token = await getToken()
            const { data } = await axios.get('/api/admin/coupons', {
                headers: { Authorization: `Bearer ${token}` }
            })
            if (data.success) setCoupons(data.coupons)
        } catch (error) {
            console.error(error)
        }
    }

    const handleAddCoupon = async (e) => {
        e.preventDefault()
        try {
            const token = await getToken()
            // Convert numerical discount and handle date object for backend
            const couponData = {
                ...newCoupon,
                discount: Number(newCoupon.discount),
                expiresAt: new Date(newCoupon.expiresAt)
            }

            const { data } = await axios.post('/api/admin/coupons', 
                { coupon: couponData },
                { headers: { Authorization: `Bearer ${token}` } }
            )

            if (data.success) {
                toast.success("Coupon added successfully")
                fetchCoupons() // Refresh list
                setNewCoupon({ // Reset form
                    code: '', description: '', discount: '',
                    forNewUser: false, forMember: false, isPublic: false,
                    expiresAt: format(new Date(), 'yyyy-MM-dd')
                })
            }
        } catch (error) {
            toast.error(error.response?.data?.error || "Error adding coupon")
            throw error;
        }
    }

    const deleteCoupon = async (code) => {
        try {
            const token = await getToken()
            const { data } = await axios.delete(`/api/admin/coupons?code=${code}`, {
                headers: { Authorization: `Bearer ${token}` }
            })

            if (data.success) {
                toast.success("Coupon removed")
                setCoupons(prev => prev.filter(c => c.code !== code))
            }
        } catch (error) {
            toast.error("Failed to delete")
            throw error;
        }
    }

    const handleChange = (e) => {
        setNewCoupon({ ...newCoupon, [e.target.name]: e.target.value })
    }

    useEffect(() => { fetchCoupons() }, [])

    return (
        <div className="text-slate-500 mb-40 p-4">
            {/* Add Coupon Form */}
            <form onSubmit={(e) => toast.promise(handleAddCoupon(e), { 
                loading: "Processing...", 
                success: "Created!", 
                error: (err) => err.response?.data?.error || "Failed" 
            })} className="max-w-sm text-sm bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <h2 className="text-2xl mb-4 text-slate-800 font-semibold">Add <span className="text-blue-600">Coupons</span></h2>
                
                <div className="flex gap-2 max-sm:flex-col">
                    <input type="text" placeholder="CODE (e.g. SAVE20)" className="w-full p-2 border border-slate-200 outline-blue-400 rounded-md uppercase"
                        name="code" value={newCoupon.code} onChange={handleChange} required
                    />
                    <input type="number" placeholder="Disc %" min={1} max={100} className="w-24 p-2 border border-slate-200 outline-blue-400 rounded-md"
                        name="discount" value={newCoupon.discount} onChange={handleChange} required
                    />
                </div>

                <input type="text" placeholder="Description" className="w-full mt-2 p-2 border border-slate-200 outline-blue-400 rounded-md"
                    name="description" value={newCoupon.description} onChange={handleChange} required
                />

                <div className="mt-4">
                    <p className="text-xs font-medium text-slate-400 mb-1">EXPIRY DATE</p>
                    <input type="date" className="w-full p-2 border border-slate-200 outline-blue-400 rounded-md"
                        name="expiresAt" value={newCoupon.expiresAt} onChange={handleChange}
                    />
                </div>

                <div className="mt-5 space-y-3">
                    <div className="flex items-center gap-3">
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" checked={newCoupon.forNewUser}
                                onChange={(e) => setNewCoupon({ ...newCoupon, forNewUser: e.target.checked })}
                            />
                            <div className="w-10 h-5 bg-slate-200 rounded-full peer peer-checked:bg-blue-600 transition-all"></div>
                            <div className="absolute left-1 top-1 w-3 h-3 bg-white rounded-full transition-all peer-checked:translate-x-5"></div>
                        </label>
                        <span className="text-slate-600">New Users Only</span>
                    </div>

                    <div className="flex items-center gap-3">
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" checked={newCoupon.forMember}
                                onChange={(e) => setNewCoupon({ ...newCoupon, forMember: e.target.checked })}
                            />
                            <div className="w-10 h-5 bg-slate-200 rounded-full peer peer-checked:bg-blue-600 transition-all"></div>
                            <div className="absolute left-1 top-1 w-3 h-3 bg-white rounded-full transition-all peer-checked:translate-x-5"></div>
                        </label>
                        <span className="text-slate-600">Members Only</span>
                    </div>
                </div>

                <button className="w-full mt-6 p-3 rounded-lg bg-slate-800 text-white font-medium hover:bg-black active:scale-[0.98] transition-all">
                    Create Coupon
                </button>
            </form>

            {/* List Coupons */}
            <div className="mt-14">
                <h2 className="text-2xl text-slate-800 font-semibold mb-6">Active <span className="text-blue-600">Promotions</span></h2>
                <div className="overflow-hidden rounded-xl border border-slate-200 max-w-5xl shadow-sm">
                    <table className="min-w-full bg-white text-sm">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr className="text-slate-500 uppercase text-[11px] tracking-wider">
                                <th className="py-4 px-6 text-left">Code</th>
                                <th className="py-4 px-6 text-left">Details</th>
                                <th className="py-4 px-6 text-left">Discount</th>
                                <th className="py-4 px-6 text-left">Expiry</th>
                                <th className="py-4 px-6 text-center">Status</th>
                                <th className="py-4 px-6 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {coupons.map((coupon) => (
                                <tr key={coupon.code} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="py-4 px-6 font-bold text-blue-600 tracking-tight">{coupon.code}</td>
                                    <td className="py-4 px-6 text-slate-500 max-w-xs truncate">{coupon.description}</td>
                                    <td className="py-4 px-6 font-medium text-slate-800">{coupon.discount}% OFF</td>
                                    <td className="py-4 px-6 text-slate-500">{format(new Date(coupon.expiresAt), 'MMM dd, yyyy')}</td>
                                    <td className="py-4 px-6 text-center">
                                        <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${new Date(coupon.expiresAt) > new Date() ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                                            {new Date(coupon.expiresAt) > new Date() ? 'Live' : 'Expired'}
                                        </span>
                                    </td>
                                    <td className="py-4 px-6 text-right">
                                        <button 
                                            onClick={() => deleteCoupon(coupon.code)}
                                            className="p-2 hover:bg-red-50 rounded-full transition-colors group"
                                        >
                                            <Trash2 className="w-4 h-4 text-slate-300 group-hover:text-red-500" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}