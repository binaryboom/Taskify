import React, { useState,useEffect } from 'react'
import { useForm } from "react-hook-form"
import Home from './Home';
import { useAlert } from '../context/AlertContext';

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [button, setButton] = useState('Continue');
  const [logged, setLogged] = useState(false);
  const [user,setUser]=useState({});
  let [created, setCreated] = useState(false);
  let [myError,setMyError]=useState({})

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUser(userData);
      setLogged(true);
    }
  }, []);
  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser({});
    setLogged(false);
  };

  const {
    register,
    handleSubmit,
    watch,
    reset,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm()

  const { showAlert } = useAlert()

  const delay = (secs) => {
    return new Promise((resolve, reject) => {
      setTimeout(
        resolve, secs * 1000
      )
    })
  }

  const onSubmit = async (data) => {
    setLoading(true)
    console.log(data)
    fetch('https://taskify-raghav.vercel.app/api/login', {
    // fetch('https://taskify-unhb.onrender.com/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    })
      .then(response => {
        if (!response.ok) {
          showAlert('Unable to connect with server :( ')
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        console.log(data);
        // if(data['error']==='Wrong Password'){
        //   setMyError({show:true,message:'Wrong Password'})  ;
        //   setTimeout(()=>{setMyError({})},2000) ;
        //   setButton('Login');      
        //   return;    
        // }
        if(data['error']){
          setMyError({show:true,message:data['error']})  ;
          showAlert(data['error']);
          setTimeout(()=>{setMyError({})},2000) ;
          // setButton('Login');      
          return;    
        }
        if (data['exist']===true) {
          showAlert('Old User','#2772db');
          setButton('Login')
        }
        
        if (data['exist']===false) {
          setButton('Signup')
          showAlert('New User','green');
        }
        if (data['logged']===true) {
          showAlert(`Welcome ${data.username}`,'green');
          setLogged(true)
          setUser({username:data.username,userId:data.userId})
          localStorage.setItem('user', JSON.stringify({ username: data.username, userId: data.userId }));
        }
        
      })
      .catch(error => {
        showAlert('Unable to connect with server :( ')
        console.error('There has been a problem with your fetch operation:', error);
      })
      .finally(() => {
        setLoading(false); 
    });
  }
  if (logged) {
    return <Home username={user.username} setButton={setButton} reset={reset} setCreated={setCreated} setLogged={setLogged} created={created} handleLogout={handleLogout} userId={user.userId}/>; // Render Home component if user is logged in
  }
  return (
    <div className='login'>
      <h1>Login / Signup</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        {button === 'Continue' ?
          <>
            <label htmlFor='username'>Enter Username :</label> <br /> <br />
            <input id='username' placeholder="enter username" {...register("username", { required: { value: true, message: 'Required' }, minLength: { value: 5, message: 'Length should be more than 5' } })} />  <br />
            {errors.username && <span style={{ color: 'red' }}>{errors.username.message}</span>} <br />
          </>
          : <>
            <label htmlFor='username'>Username :</label> <br /> <br />
            <input value={getValues('username')} /><br /><br />
          </>}

        {button === 'Login' ?
          <>
            <label htmlFor='password'>Enter Password :</label> <br /> <br />
            <input id='password' type='password' placeholder='enter password' {...register('password',
              { required: { value: true, message: 'Required' }, })} /> <br />
              {errors.password && <span style={{ color: 'red' }}>{errors.password.message}</span>} <br /><br />
          </> : button === 'Signup' ?
            <>
              <label htmlFor='password'>Enter Password :</label> <br /> <br />
              <input id='password' type='password' placeholder='enter password' {...register('password',
                { required: { value: true, message: 'Required' }, })} /> <br /><br />
              <input id='confirmPassword' type='password' placeholder='confirm password' {...register('confirmPassword', {
                required: { value: true, message: 'Required' },
                validate: (value) => value === watch('password') || 'Passwords do not match',
              })} /> <br />
              {errors.confirmPassword && <span style={{ color: 'red',fontSize:'1.5rem' }}>{errors.confirmPassword.message}</span>} <br />
            </> : ''}


        <input className='btn' disabled={loading} type="submit" value={button} /> <br /> <br />
        {myError.show && <span style={{ color: 'red' }}>{myError.message}</span>} <br />
        <br />
        {/* {errors.myError && toast.error(errors['myError']['message'], {errProps})}  */}
        {loading && <center><span class="loader"></span></center> }

        

      </form>
    </div>
  )
}

export default Login
