import { useState, useEffect } from "react";
import supabase from "../supabase";

export default function useAuth() {
    const [user, setUser] = useState(null)
    const
}