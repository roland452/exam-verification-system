import React from 'react'
import Courses from '../sections/course'
import useAdminContext from '../adminContext'
import NoticeManager from '../sections/noticeManager'
const Content = () => {
  const section = useAdminContext((state) => state.adminSection)
  return (
    <div className='h-[99vh] w-full overflow-hidden relative'>
      <Courses section={section} />
      <NoticeManager section={section}/>
    </div>
  )
}

export default Content
