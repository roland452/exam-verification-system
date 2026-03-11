import { AiOutlineBars } from "react-icons/ai"; 
import React from 'react'
import useAdminContext from "../adminContext";


const Header = () => {
  const navActive = useAdminContext((state) => state.navActive)
  const setNavActive = useAdminContext((state) => state.setNavActive)
  return (
    <div className="text-[20px] p-2 md:hidden">
      <AiOutlineBars onClick={() => setNavActive(!navActive)}/>
    </div>
  )
}

export default Header
 