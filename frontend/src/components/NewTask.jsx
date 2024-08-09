import { useEffect, useState } from 'react';
import React from 'react';
import { useForm } from 'react-hook-form';





const TaskForm = ({ userId,created,setCreated ,setModal}) => {
    let [users, setUser] = useState([]);
    
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
        fetch('http://localhost:3000/api/findAllUsers')
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
    const { handleSubmit, register, formState: { errors } } = useForm({});
    const onSubmit = async (data) => {
        console.log(data)
        fetch('http://localhost:3000/api/task', {
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
                if (data.created===true) {
                    setCreated(true);
                }
                // console.log(data.created);

            })
            .catch(error => {
                console.error('There has been a problem with your fetch operation:', error);
            })
    }

    return (

<>
{created===true? <h1>Task Created Successfully 🎉</h1> :
        <form id="newTask" onSubmit={handleSubmit(onSubmit)}>
            <br /><br />
            <div>
                <input type='hidden'
                    id="userId" value={userId}
                    {...register('userId')}
                    />
                <input type='hidden'
                    id="assignedBy" value={userId}
                    {...register('assignedBy')}
                    />
                <label htmlFor="title">Title:</label> &nbsp;&nbsp;&nbsp;
                <input
                    id="title"
                    {...register('title', { required: 'Title is required' })}
                    />
                {errors.title && <p>{errors.title.message}</p>}
            </div> <br />

            <div>
                <label htmlFor="description">Description:</label>&nbsp;&nbsp;&nbsp;
                <textarea rows='5' cols='30'
                    id="description"
                    {...register('description')}
                    />
            </div>

            <div> <br />
                <label htmlFor="dueDate">Due Date:</label> &nbsp;&nbsp;&nbsp;
                <input type='date'
                    id="dueDate"
                    {...register('dueDate')}
                    />
            </div>

            <div> <br />
                <label htmlFor="priority">Priority:</label>&nbsp;&nbsp;&nbsp;
                <select {...register("priority")}>
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="Urgent">Urgent</option>
                </select>
                {/* </div>

<div> <br /> */} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;

                <label htmlFor="status">Status:</label>&nbsp;&nbsp;&nbsp;
                <select {...register("status")} >
                    <option value="To Do">To Do</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Done">Done</option>
                </select>
            </div>

            <div> <br />
                <label htmlFor="assignedTo">Assigned To:</label>&nbsp;&nbsp;&nbsp;

                <div className="all-users">
                    {users.map((user) => (
                        <div key={user.username}>
                            {/* {console.log(user)} */}
                            <input
                                type="checkbox"
                                id={`assignedTo-${user.username}`}
                                {...register("assignedTo")}
                                value={user._id}
                                />
                            <label htmlFor={`assignedTo-${user.username}`}>{user.username}</label>
                        </div>
                    ))}
                </div>



            </div>
            <br />
            <input type="submit" value='Create' className='btn' />
        </form>
        }
                    </>
    );

};

export default TaskForm;
