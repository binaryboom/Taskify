import React, { useEffect, useState } from 'react'

const inbox = ({userId}) => {
  function formatDateTime(isoString) {
    const date = new Date(isoString);
  
    const options = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    };
  
    return date.toLocaleDateString('en-IN', options) + '\n'
  }
  let [emails,setEmails]=useState('none')
  useEffect(() => {
    fetch('https://taskify-unhb.onrender.com/api/findAllEmails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({userId:userId})
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      if(data['found']===true){
        console.log(data['email'])
        setEmails(data['email']);
        return data;
      }
      else{
        setEmails('none')
        console.log(data)
      }
    })
    .catch(error => {
        console.error('There has been a problem with your fetch operation:', error);
    })
          
    },[]);
    if(emails==='none'){
      return (
       <center><h1>No Emails Available 😪</h1></center>
      )
  }
  return (
    <>
    {emails==='none'?<center><h1>No Emails Available 😪</h1></center>:
    <div className='inbox'>
      {emails.map(e=>(

      <div className="inbox-card">
        <div className='sender'> &#8226; From : {e.from.username}</div>
        <div style={{backgroundColor:e.priority==='Low'?'blue':e.priority==='Medium'?'yellow':'#f95959'}} className='priority'>{e.priority}</div>
        <div className='content'>{e.content}</div>
        <div className='time'>{formatDateTime(e.time)}</div>
      </div>
      ))}
    </div>}
    </>
  )
}


export default inbox
