import React from 'react'
import NavBtn from './components/navBtn'
import Content from './components/content'

const DashBoard = () => {
  return (
    <div className='grid grid-cols-[1fr] md:grid-cols-[.5fr_2fr] h-[100vh]'>  
      <NavBtn />
      <Content />
    </div>
  )
}

export default DashBoard
