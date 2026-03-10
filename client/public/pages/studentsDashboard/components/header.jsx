import { AiOutlineBars } from "react-icons/ai"; 
import React from 'react'
import useDashBoardContext from "../dashBoardContext";


const Header = () => {
  const navActive = useDashBoardContext((state) => state.navActive)
  const setNavActive = useDashBoardContext((state) => state.setNavActive)
  return (
    <div className="text-[20px] p-2 md:hidden">
      <AiOutlineBars onClick={() => setNavActive(!navActive)}/>
    </div>
  )
}

export default Header
