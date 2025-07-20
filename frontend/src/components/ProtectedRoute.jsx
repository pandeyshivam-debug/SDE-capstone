import { useEffect, useState,  } from "react"
import { useNavigate } from "react-router-dom"
import { auth } from '../firebase'
import Loader from "./Loader"

export default function ProtectedRoute({ children }) {
    const [loading, setLoading] = useState(true)
    const [user, setUser] = useState(null)
    const navigate = useNavigate()

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((currentUser) => {
        if(!currentUser)
            navigate('/') // not logged in
        else 
            setUser(currentUser)
            // setTimeout(() => setLoading(false), 1500)
            setLoading(false)
        })
        return () => unsubscribe()
    }, [navigate])

    if(loading) {
        return(<Loader text="Authenticating..." />)
    }
    return user ? children : null
}