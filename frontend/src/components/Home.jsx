import {React,useState,useEffect} from 'react'
import NewTask from './NewTask'
import AllTasks from './AllTasks';
import Inbox from './Inbox'
import UpdateTask from './UpdateTask'


const Home = ({username,userId ,setButton,setLogged,reset,setCreated,created}) => {
  const [modal, setModal] = useState('getAllTasks');
  let [task,setTask]=useState([]);
  let [editTask,setEditTask]=useState([]);
    useEffect(() => {
      if (modal === 'getAllTasks') {
      fetch('https://taskify-unhb.onrender.com/api/findAllTasks', {
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
        if(data['found']){
          console.log(data['tasks'])
          setTask(data['tasks']);
          setModal('getAllTasks')
          return data;
        }
        else{
          setTask('none')
          console.log(data)
        }
      })
      .catch(error => {
          console.error('There has been a problem with your fetch operation:', error);
      })
    } 
      },[modal]);

  return (
    <>
    <div className="homebar">
      <div className='user-logged'>Welcome {username} ,</div>
      <div style={{display:modal==='getAllTasks'?'none':''}}><input onClick={()=>{setModal('getAllTasks') ,setCreated(false)}}  type="submit" value="All Tasks" /></div>
      <div style={{display:modal==='inbox'?'none':''}}><input onClick={()=>{setModal('inbox')}}  type="submit" value="Inbox" /></div>
      <div style={{display:modal==='newTask'?'none':''}}><input onClick={()=>{setModal('newTask') ,setCreated(false)}}  type="submit" value="New Task" /></div>
      <div><input onClick={()=>{setModal('login') ,setLogged(false),reset(),setButton('Continue')}}  type="submit" value="Logout" /></div>
    </div>
        
    <div className='home'>
      {modal==='newTask'?<NewTask setModal={setModal} userId={userId} setCreated={setCreated} created={created}/>
      :modal==='getAllTasks'?<AllTasks setModal={setModal} setEditTask={setEditTask} userId={userId} allTasks={task} />
      :modal==='updateTask'?<UpdateTask setModal={setModal} userId={userId} task={editTask} />
      :modal==='inbox'?<Inbox userId={userId} />
      :''}         
    </div>
    </>
  )
}

export default Home;
