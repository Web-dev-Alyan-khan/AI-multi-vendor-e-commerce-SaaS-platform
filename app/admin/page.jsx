'use client'
import Loading from "@/components/Loading"
import OrdersAreaChart from "@/components/OrdersAreaChart"
import axios from "axios"
import { CircleDollarSign, ShoppingBasket, Store, Tags, TrendingUp, ArrowUpRight } from "lucide-react"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"
import { useAuth } from "@clerk/nextjs"

export default function AdminDashboard() {
    const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || '$'
    const { getToken } = useAuth()
    const [loading, setLoading] = useState(true)

    const [dashboardData, setDashboardData] = useState({
        products: 0,
        revenue: 0,
        orders: 0,
        stores: 0,
        allOrders: [],
    })

    const dashboardCardsData = [
        { 
            title: 'Total Revenue', 
            value: `${currency}${dashboardData.revenue.toLocaleString()}`, 
            icon: CircleDollarSign, 
            color: 'text-emerald-600', 
            bg: 'bg-emerald-50',
            trend: '+12.5% from last month' 
        },
        { 
            title: 'Total Orders', 
            value: dashboardData.orders, 
            icon: Tags, 
            color: 'text-blue-600', 
            bg: 'bg-blue-50',
            trend: '+5.2% from last week' 
        },
        { 
            title: 'Active Stores', 
            value: dashboardData.stores, 
            icon: Store, 
            color: 'text-orange-600', 
            bg: 'bg-orange-50',
            trend: '2 new today' 
        },
        { 
            title: 'Total Products', 
            value: dashboardData.products, 
            icon: ShoppingBasket, 
            color: 'text-purple-600', 
            bg: 'bg-purple-50',
            trend: 'Live across all stores' 
        },
    ]

    const fetchDashboardData = async () => {
        try {
            const token = await getToken()
            const { data } = await axios.get('/api/admin/dashboard', {
                headers: { Authorization: `Bearer ${token}` }
            })
            if (data.success) setDashboardData(data.dashboardData)
        } catch (error) {
            toast.error(error.response?.data?.error || "Failed to load dashboard")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { fetchDashboardData() }, [])

    if (loading) return <Loading />

    return (
        <div className="min-h-screen bg-[#f8fafc] p-4 md:p-8">
            {/* Header Section */}
            <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
                        Dashboard <span className="text-blue-600 text-lg font-normal">v1.0</span>
                    </h1>
                    <p className="text-slate-500 mt-1">Welcome back! Here's what's happening with Gocart today.</p>
                </div>
                <button 
                    onClick={fetchDashboardData}
                    className="flex items-center gap-2 bg-white border border-slate-200 px-4 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 transition-all shadow-sm active:scale-95"
                >
                    Refresh Data
                </button>
            </div>

            {/* Statistics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {dashboardCardsData.map((card, index) => (
                    <div key={index} className="group bg-white border border-slate-200 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all hover:-translate-y-1 relative overflow-hidden">
                        {/* Decorative Background Shape */}
                        <div className={`absolute -right-4 -top-4 w-24 h-24 rounded-full ${card.bg} opacity-20 group-hover:scale-150 transition-transform duration-500`} />
                        
                        <div className="flex justify-between items-start relative z-10">
                            <div>
                                <p className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-1">{card.title}</p>
                                <h3 className="text-3xl font-bold text-slate-800">{card.value}</h3>
                            </div>
                            <div className={`${card.bg} ${card.color} p-3 rounded-xl`}>
                                <card.icon size={24} />
                            </div>
                        </div>
                        
                        <div className="mt-4 flex items-center gap-2 relative z-10">
                            <span className="flex items-center text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                                <TrendingUp size={12} className="mr-1" /> {card.trend.split(' ')[0]}
                            </span>
                            <span className="text-xs text-slate-400 truncate">{card.trend.split(' ').slice(1).join(' ')}</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Main Visual Content */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* Chart Area */}
                <div className="xl:col-span-2 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-xl font-bold text-slate-800">Sales Overview</h2>
                            <p className="text-sm text-slate-400">Monthly revenue and order analytics</p>
                        </div>
                        <div className="flex bg-slate-100 p-1 rounded-lg">
                            <button className="px-3 py-1 text-xs font-medium bg-white rounded-md shadow-sm text-slate-700">Monthly</button>
                            <button className="px-3 py-1 text-xs font-medium text-slate-500 hover:text-slate-700">Weekly</button>
                        </div>
                    </div>
                    <div className="h-[350px] w-full">
                        <OrdersAreaChart allOrders={dashboardData.allOrders} />
                    </div>
                </div>

                {/* Quick Actions / Status Area */}
                <div className="space-y-6">
                    <div className="bg-blue-600 rounded-2xl p-6 text-white shadow-lg shadow-blue-200 relative overflow-hidden">
                        <ArrowUpRight className="absolute right-4 top-4 text-white/20 w-20 h-20" />
                        <h3 className="text-lg font-semibold mb-2">Grow Your Platform</h3>
                        <p className="text-blue-100 text-sm mb-4">You have 5 store applications pending review. Approve them to increase revenue.</p>
                        <button className="w-full bg-white text-blue-600 py-2.5 rounded-xl font-bold text-sm hover:bg-blue-50 transition-colors">
                            Review Applications
                        </button>
                    </div>

                    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                        <h3 className="font-bold text-slate-800 mb-4">Quick Stats</h3>
                        <div className="space-y-4">
                            {[
                                { label: 'Conversion Rate', value: '3.2%', progress: 65 },
                                { label: 'Store Retention', value: '98%', progress: 98 },
                                { label: 'Avg. Order Value', value: `${currency}42.00`, progress: 45 }
                            ].map((stat, i) => (
                                <div key={i}>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="text-slate-500">{stat.label}</span>
                                        <span className="font-semibold text-slate-700">{stat.value}</span>
                                    </div>
                                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                                        <div className="bg-blue-500 h-full rounded-full transition-all duration-1000" style={{ width: `${stat.progress}%` }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}