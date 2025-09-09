import React from 'react'
import { Outlet } from 'react-router-dom';
import Navbar from '../../Components/educator/Navbar';
import SideBar from '../../Components/educator/SideBar';
import Footer from '../../Components/educator/Footer';

const Educator = () => {
  return (
    <div className='text-default min-h-screen bg-white'>
      <Navbar />
      <div className='flex'>
        <SideBar />
        <div className='flex-1'>
       {<Outlet />}
       </div>
      </div>
      <Footer />
    </div>
  )
}

export default Educator
