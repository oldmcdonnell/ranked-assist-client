import { useContext, useEffect, useReducer, useState } from "react"
import { AuthContext } from "./context"
import { useNavigate } from "react-router-dom"
import { mainReducer } from "./reducers/main-reducer"


function Logout() {
    const { state, dispatch } = useContext(AuthContext);
    const navigate = useNavigate()

    useEffect(()=> {
        if (state.accessToken == undefined){
            navigate('/login/')
        }
      },[navigate, state.accessToken])


    const logoutUser = () => {
        dispatch({
            type: 'LOGOUT'
            })
        console.log(' should be clear')
        
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