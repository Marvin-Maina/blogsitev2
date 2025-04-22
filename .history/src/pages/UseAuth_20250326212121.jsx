import { useState, useEffect } from "react";
import supabase from "../supabase";

export default function useAuth() {
    const [user, setUser] = useState(null)
    const [role, setRole ] = useState(null)
    const [loading, setLoading] = useState(true)
}

useEffect(() => {
    const fetchUser = async () => {
        const {
            data: {user},
        } = await supabase.auth.getUser()

        if (user) {
            setUser(user)
            fetchUserRole(user.id)
        } else {
            setLoading(false)
        }
    }

    const fetchUserRole = async (userId) => {
        const {data, error} = await supabase
        .from("profiles")
        .select("role")
        .eq("id", userId)
        .single()

        if (error) {
            console.error("Error fetching role:", error)
        } else {
            setRole(data?.role)
        }
        set
    }
})