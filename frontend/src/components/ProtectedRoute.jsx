import { useEffect, useState,  } from "react"
import { useNavigate } from "react-router-dom"
import { auth } from '../firebase'

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
        return(
            <div className="flex items-center justify-center h-screen bg-gray-900">
                <div className="flex space-x-2">
                    <div className="w-4 h-4 bg-blue-500 rounded-full animate-bounce"></div>
                    <div className="w-4 h-4 bg-blue-500 rounded-full animate-bounce delay-200"></div>
                    <div className="w-4 h-4 bg-blue-500 rounded-full animate-bounce delay-400"></div>
                </div>
            </div>
        )
    }
    return user ? children : null
}