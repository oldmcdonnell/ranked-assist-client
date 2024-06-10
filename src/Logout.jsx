import { useContext, useEffect, useState } from "react"
import { AuthContext } from "./context"
import { useNavigate } from "react-router-dom"

function Logout() {
    const { auth } = useContext(AuthContext)
    const navigate = useNavigate()

    useEffect(()=> {
        if (auth.accessToken == undefined){
          navigate('/login/')
        }
      },[navigate, auth.accessToken])


    const logoutUser = (token) => {
        auth.setAccessToken("")
        localStorage.removeItem("token")
        console.log('token should be clear', token)
        
    }

    return(
        <>
        <div>
            <button
            onClick={() => logoutUser()}
            >
            Logout
            </button>
            </div>
        </>
    )
}

export default Logout