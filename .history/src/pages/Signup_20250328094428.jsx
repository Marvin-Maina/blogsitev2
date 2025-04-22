import { useState } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "../supabase";

export default function Signup () {
    const [email , setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [role, setRole] = useState("Writer")
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    async function handleSignup() {
        setLoading(true)

        const 
        
    }
}