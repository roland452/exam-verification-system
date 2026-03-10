import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import './index.css'
import AuthComponent from '../public/auth/authComponent.jsx'
import ClientAuthprovider from './clientAuthprovider.jsx'
import AdminAuthprovider from './adminAuthprovider.jsx'

import Toast from './assets/toast.jsx'
import DashBoard from '../public/pages/studentsDashboard/dashboard.jsx'
import AdminDasboard from '../public/pages/adminDashboard/adminDasboard.jsx'



createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
    <div className='relative'>
       <Routes>
          <Route path='/' element={ <AuthComponent /> } />
          <Route path='/dashboard' element={ <ClientAuthprovider> <DashBoard /> </ClientAuthprovider> } />
          <Route path='/admin' element={ <AdminAuthprovider> <AdminDasboard /> </AdminAuthprovider>  } />
        </Routes>
        <Toast />
    </div>
    </BrowserRouter>
  </StrictMode>
)
