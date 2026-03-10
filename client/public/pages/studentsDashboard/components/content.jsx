import React from 'react'
import Header from './header'
import useDashBoardContext from '../dashBoardContext'
import Portal from '../sections/portal/portal'
import Verification from '../sections/verification/verification'
import EditProfile from '../sections/portal/editProfile'


const Content = () => {
  const section = useDashBoardContext((state) => state.dashBoardSection)
  return (
    <div className='h-[99vh] w-full grid grid-rows-[5%_1fr] overflow-hidden'> 
      <Header />
      <div className='relative'>
        <Portal section={section}/>
        <Verification section={section}/>
        <EditProfile section={section}/>
      </div>
    </div>
  )
}

export default Content
