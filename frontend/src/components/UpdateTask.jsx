import { useEffect, useState } from 'react';
import React from 'react';
import { useForm } from 'react-hook-form';
import { useAlert } from '../context/AlertContext';


const UpdateTask = ({ userId,created,setCreated ,setModal,task}) => {
    const { showAlert } = useAlert()
    let [users, setUser] = useState([]);
    const { handleSubmit,setValue, register, formState: { errors } } = useForm({});
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A'; 
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = String(date.getFullYear()); 
        return `${year}-${month}-${day}`;
      };
    useEffect(() => {
        setValue('title', task.title);
        setValue('description', task.description);
        setValue('dueDate', formatDate(task.dueDate));
        setValue('priority', task.priority);
        setValue('status', task.status);
        setValue('taskId',task._id)
    }, []);

      const closeEditModal = () => {
        setModal('getAllTasks');
      };
    useEffect(() => {
        if (created) {
            const timer = setTimeout(() => {
                setModal('getAllTasks');
                setCreated(false); 
            }, 2000);

            return () => clearTimeout(timer);
        }
    }, [setModal,created, setCreated]);
    
    useEffect(() => {
        fetch('https://taskify-raghav.vercel.app/api/findAllUsers')
        // fetch('https://taskify-unhb.onrender.com/api/findAllUsers')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                setUser(data);
               
            })
            .catch(error => {
                console.error('There has been a problem with your fetch operation:', error);
            })

    }, []);
    
    const onSubmit = async (data) => {
        console.log(data)
    
        fetch('https://taskify-raghav.vercel.app/api/task/updateTask', {
        // fetch('https://taskify-unhb.onrender.com/api/task/updateTask', {
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
                if (data.updated===true) {
                    showAlert('Task Updated Successfully','green')
                    setModal('getAllTasks')
                }
                if (data.error) {
                    showAlert(data.error)
                    setModal('getAllTasks')
                }
               

            })
            .catch(error => {
                console.error('There has been a problem with your fetch operation:', error);
            })
    }

    return (

<>
{created===true? <h1>Task Updated Successfully 🎉</h1> :
        (
            <div className="edit-modal">
              <form id="newTask" onSubmit={handleSubmit(onSubmit)}>
                <br />
                <br />
                <div>
                  <input
                    type="hidden"
                    id="userId"
                    value={userId}
                    {...register('userId')}
                  />
                  <input
                    type="hidden"
                    id="taskId"
                    value={task._id}
                    {...register('taskId')}
                  />
                  <input
                    type="hidden"
                    id="assignedBy"
                    value={userId}
                    {...register('assignedBy')}
                  />
                  <label htmlFor="title">Title:</label> &nbsp;&nbsp;&nbsp;
                  <input
                    id="title"
                    {...register('title', { required: 'Title is required' })}
                  />
                  {errors.title && <p>{errors.title.message}</p>}
                </div>
                <br />
                <div>
                  <label htmlFor="description">Description:</label>&nbsp;&nbsp;&nbsp;
                  <textarea
                    rows="5"
                    cols="30"
                    id="description"
                    {...register('description')}
                  />
                </div>
                <div>
                  <br />
                  <label htmlFor="dueDate">Due Date:</label> &nbsp;&nbsp;&nbsp;
                  <input type="date" id="dueDate" {...register('dueDate')} />
                </div>
                <div>
                  <br />
                  <label htmlFor="priority">Priority:</label>&nbsp;&nbsp;&nbsp;
                  <select {...register('priority')}>
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="Urgent">Urgent</option>
                  </select>
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  <label htmlFor="status">Status:</label>&nbsp;&nbsp;&nbsp;
                  <select {...register('status')}>
                    <option value="To Do">To Do</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Done">Done</option>
                  </select>
                </div>
                <div>
                  <br />
                  <label htmlFor="assignedTo">Assigned To:</label>&nbsp;&nbsp;&nbsp;
                  <div className="all-users">
                    {users.map((user) => (
                      <div key={user.username}>
                        <input
                          type="checkbox"
                          id={`assignedTo-${user.username}`}
                          {...register('assignedTo')}
                          value={user._id}
                          defaultChecked={task.assignedTo.some(
                            (assignedUser) => assignedUser._id === user._id
                          )}
                        />
                        <label htmlFor={`assignedTo-${user.username}`}>
                          {user.username}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                <br />
                <input type="submit" value="Update Task" className="btn" /> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <input  onClick={closeEditModal} type="submit" value="Cancel" className="btn" />
               
              </form>
            </div>
          )}
          
                    </>
    );

};

export default UpdateTask;
