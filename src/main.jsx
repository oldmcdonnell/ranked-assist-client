import React, { useState, useEffect, useContext, useReducer } from 'react'
import ReactDOM from 'react-dom/client'
import { Navigate } from 'react-router-dom'
import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
} from 'react-router-dom'

// project styles
import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css'

import App from './App'
import ErrorPage from './ErrorPage'
import Header from './Header'
import Footer from './Footer'
import Login from './Login'
import { AuthContext } from './context'
import CreateNewUser from './CreateNewUser'
import { initialMainState, mainReducer } from './reducers/main-reducer';
import CreateVote from './CreateVote'
import MyProfile from './MyProfile'


const Protected = ({ component }) => {
  const { state } = useContext(AuthContext);
  console.log('protected auth state ', state);
  return state?.accessToken ? (
    <>
      {component}
    </>
  ) : (
    <Navigate to="/login" replace={true}/>
  );
};


function Layout() {
  return (
    <>
      <Header />
        <div id='page-content'>
          <Outlet />
        </div>
      <Footer />
    </>
  )
}


const router = createBrowserRouter([
  {
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: '/',
        element: <Protected component={<App />} />
      },
      {
        path: '/login',
        element: <Login />
      },
      {
        path: '/createnewuser',
        element: <CreateNewUser />
      },
      {
        path: '/createvote',
        element: <Protected component={<CreateVote />} /> 
      },
      {
        path: '/myprofile',
        element: <Protected component={<MyProfile />} /> 
      },
    ]
  }
])

const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(mainReducer, initialMainState)

  const main = {
    state,
    dispatch,
  };

  return (
    <AuthContext.Provider value ={{ state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <AuthContextProvider>
    <RouterProvider router={router} />
  </AuthContextProvider>
)
