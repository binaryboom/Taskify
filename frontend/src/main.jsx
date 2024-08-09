import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import Home from './components/Home.jsx'
import Layout from './components/Layout.jsx'
import { createBrowserRouter,RouterProvider } from 'react-router-dom'
import Login from './components/Login.jsx'
import { AlertProvider } from './context/AlertContext.jsx';



const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />, 
    children: [
      {
        index: true,
        element: <Login />,
      },
    ],
  },
])
ReactDOM.createRoot(document.getElementById('root')).render(
  <AlertProvider>
  <React.StrictMode>
 
  <RouterProvider router={router}/>
  <App />

   </React.StrictMode>
   </AlertProvider>,
)
