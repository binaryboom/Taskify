import React from 'react'

const Navbar = ({username}) => {
  return (
    <div className='navbar'>
      <div className="logo">Taskify</div>
      {username && <div className="user"><button>{username}</button></div>}
      
    </div>
  )
}

export default Navbar
