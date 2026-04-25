'use client'
import { useEffect, useState } from "react"
import Loading from "../Loading"
import Link from "next/link"
import { ArrowRightIcon } from "lucide-react"
import AdminNavbar from "./AdminNavbar"
import AdminSidebar from "./AdminSidebar"
import { useAuth, useUser } from "@clerk/nextjs"
import axios from "axios"

const AdminLayout = ({ children }) => {

    const { user, isLoaded } = useUser()
    const { getToken } = useAuth()

    const [isAdmin, setIsAdmin] = useState(false)
    const [loading, setLoading] = useState(true)

    const fetchIsAdmin = async () => {
        try {
            const token = await getToken()

            const { data } = await axios.get('/api/admin/is-admin', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            setIsAdmin(data.success || false)

        } catch (error) {
            console.error(error)
            setIsAdmin(false)
        } finally {
            setLoading(false) // ✅ always stop loading
        }
    }

    useEffect(() => {
        if (isLoaded && user) {
            fetchIsAdmin()
        } else if (isLoaded && !user) {
            setLoading(false)
        }
    }, [user, isLoaded, getToken])

    return loading ? (
        <Loading />
    ) : isAdmin ? (
        <div className="flex flex-col h-screen">
            <AdminNavbar />
            <div className="flex flex-1 h-full overflow-hidden">
                <AdminSidebar />
                <div className="flex-1 p-5 lg:pl-12 lg:pt-12 overflow-y-auto">
                    {children}
                </div>
            </div>
        </div>
    ) : (
        <div className="min-h-screen flex flex-col items-center justify-center text-center px-6">
            <h1 className="text-2xl sm:text-4xl font-semibold text-slate-400">
                You are not authorized to access this page
            </h1>

            <Link href="/" className="bg-slate-700 text-white flex items-center gap-2 mt-8 p-2 px-6 rounded-full">
                Go to home <ArrowRightIcon size={18} />
            </Link>
        </div>
    )
}

export default AdminLayout