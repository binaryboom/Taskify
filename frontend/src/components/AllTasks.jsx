import React, { useState } from 'react'
import { useAlert } from '../context/AlertContext';


const AllTasks = ({allTasks,userId,setModal,setEditTask}) => {
  
  const { showAlert } = useAlert()
    let i=0;
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A'; 
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = String(date.getFullYear()); 
        return `${day}/${month}/${year}`;
      };

    if(allTasks==='none'){
        return (
          <center><h1>No Tasks Available 😎</h1></center> 
        )
    }
   async function deleteTask(whom,userId,taskId){

    let data={
      whom:whom,
      userId:userId,
      taskId:taskId
    }
    fetch('https://taskify-unhb.onrender.com/api/deleteTask', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        console.log(data);
         if(data['error']){
          showAlert(data['error'])
          return;
         }
         if(data['deleted']){
          showAlert(`Task deleted for ${data['for']}`,'green')
          setModal()
          setTimeout(()=>{
            setModal('getAllTasks')
          },100)
          return;
         }
        
      })
      .catch(error => {
        console.error('There has been a problem with your fetch operation:', error);
      })
      
    }
  return (
    <>
    {allTasks.length===0?<center><h1>No Tasks Available 😪</h1></center>:
    <div className='allTasks'>
      <table>
        <thead><tr>
            <th>S.No</th>
            <th>Title</th>
            <th>Description</th>
            <th>Due Date</th>
            <th>Priority</th>
            <th>Status</th>
            <th>Assigned To</th>
            <th>Assigned By</th>
            <th>Delete</th>
            <th>Edit</th>
            </tr></thead>
        <tbody>
            {
              allTasks.map((t)=>(
                <tr style={{backgroundColor:t.status==='Done'?'#42b883':t.priority==='Low'?'#8dc6ff':t.priority==='Medium'?'yellow':'#f95959'}}>
                    <td>{++i}</td>
                    <td>{t.title}</td>
                    <td>{t.description}</td>
                    <td>{formatDate(t.dueDate)}</td>
                    <td>{t.priority}</td>
                    <td>{t.status}</td>
                    <td>{t.assignedTo.map(e=>(<li>{e.username}</li>))}</td>
                    <td>{t.assignedBy.username}</td>
                    <td>{<><abbr onClick={()=>{deleteTask('me',userId,t._id)}} title='Delete for me'><i class="fa-solid fa-user"></i></abbr> <br /> <br />
                    <abbr onClick={()=>{deleteTask('everyone',userId,t._id)}} title='Delete for Everyone'><i class="fa-solid fa-large fa-users"></i></abbr>  </>}</td>
                    <td>{<i  onClick={()=>{setModal('updateTask'),setEditTask(t)}} class="fa-solid fa-xl fa-pen-to-square"></i>}</td>
                </tr>
                ))
              }
        </tbody>
      </table>
    </div>}
              </>
  )
}

export default AllTasks
