import React, { useState } from 'react';
import PortalStatus from './portalStatus';
import Setup from './setUp';
import useProfile from '../../../../context/profile';

const Portal = ({ section }) => {
    const profile = useProfile((state) => state.profile)
    const profileLoading = useProfile((state) => state.profileLoading)
    const profileError = useProfile((state) => state.profileError)
    const isProfileComplete = profile.isProfileComplete
    return (
        <div className={`absolute w-full min-h-screen transition-all duration-[.2s] ease ${section === 'portal'? 'translate-x-[0]' : 'translate-x-[120%]'} flex items-center justify-center p-0 font-sans`}>
            
            {   
            !isProfileComplete && profileLoading ? 
            ( <div>loading...</div> ):

            !isProfileComplete && profileError ?
            ( <div>error</div> ):

            isProfileComplete ? 
            ( <PortalStatus /> ):

            ( <Setup />  )
            }
        </div>
    );
};

export default Portal;
