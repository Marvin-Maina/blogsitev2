import { useState, useEffect, createContext, useContext } from "react";
import supabase from "../supabase";

const AuthContext = createContext();

// Auth Provider to Wrap App
export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [role, setRole] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            const {
                data: { user },
            } = await supabase.auth.getUser();

            if (user) {
                setUser(user);
                fetchUserRole(user.id);
            } else {
                setLoading(false);
            }
        };

        const fetchUserRole = async (userId) => {
            const { data, error } = await supabase
                .from("profiles")
                .select("role")
                .eq("id", userId)
                .single();

            if (error) {
                console.error("Error fetching role:", error);
            } else {
                setRole(data?.role);
            }
            setLoading(false);
        };

        fetchUser();
    }, []);

    return (
        <AuthContext.Provider value={{ user, role, loading }}>
            {children}
        </AuthContext.Provider>
    );
}

// Custom Hook to Use Auth
export function useAuth() {
    return useContext(AuthContext);
}
