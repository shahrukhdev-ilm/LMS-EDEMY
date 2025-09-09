import React, { useContext } from 'react'
import { assets } from '../../assets/assets.js'
import { Link, useNavigate } from 'react-router-dom'
import { useClerk, UserButton, useUser,} from '@clerk/clerk-react'

import { AppContext } from '../../context/AppContext'




const Navbar = () => {
  const navigate = useNavigate();
  const { openSignIn } = useClerk();
  const { user } = useUser();
  const { isEducator } = useContext(AppContext);

  return (
    <div className={`flex items-center justify-between px-4 sm:px-10 md:px-14 lg:px-36 border-b border-gray-500 py-4`}>
      <img onClick={() => navigate('/')} src={assets.logo} alt="logo" className='w-28 lg:w-32 cursor-pointer' />
    <div className='hidden md:flex items-center gap-5 text-gray-500'>
      <div className='flex items-center gap-5'>
        { user &&
          <>
            <button onClick={()=> {navigate('/educator')}}>{isEducator ? 'Educator Dashboard' : 'Become Educator'}</button>
            <Link to='/my-enrollments'>My Enrollments</Link>
          </>
        }
      </div>
     { user ? <UserButton/> :
      <button onClick={() => openSignIn()} className='bg-blue-600 text-white px-5 py-2 rounded-full'>Create Account</button>}
    </div>
    <div className='md:hidden flex items-center gap-2 sm:gap-5 text-gray-500'>
      <div className='flex items-center gap-1 sm:gap-2 max-sm:text-xs'>
        { user &&
          <>
            <button onClick={()=> {navigate('/educator')}}>{isEducator ? 'Educator Dashboard' : 'Become Educator'}</button>
            <Link to='/my-enrollments'>My Enrollments</Link>
          </>
        }
      </div>
      {
      user ? <UserButton/> :
      <button onClick={() => openSignIn()}><img src={assets.user_icon} alt="" /> </button>
    }
    </div>
    </div>
    
  )
}

export default Navbar
