import { useState } from "react";
import { Form, useNavigate } from "react-router-dom";
import url from '../utils/apiUrl'
import { useSession } from "../hooks/useSession";

export default function SigninPage(){
  const [registerError, setRegisterError] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [, setIsLogged] = useSession();
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  async function signin(username, password){
    return await fetch(url + '/signin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email,
        username,
        password
      }),
      credentials: 'include'
    });
  }
  
  async function onButtonClick () {
    try {
      setRegisterError('')
      const response = await signin(username, password);
      if (!response.ok)
        throw new Error(await response.json());
      setIsLogged(true);
      navigate('/');
    } catch (err) {
      console.log(err);
      setRegisterError(err.name + ' ' + err.message);
    }
  }

  return (
    <main className='container form-container'>
      <Form action="/signin" className='session__form'>
        <label className="form__label" htmlFor='email'>
          Email
          <input
              type='text'
              id='email'
              value= {email}
              onChange={e => setEmail(e.target.value)}/>
        </label>
        <label className="form__label" htmlFor='username'>
          Username
          <input
              type='text'
              id='username'
              value= {username}
              onChange={e => setUsername(e.target.value)}/>
        </label>
        <label className="form__label" htmlFor='password'>
          Password
          <input
              type='password'
              id='password'
              value= {password}
              onChange={e => setPassword(e.target.value)}/>
        </label>
        <label className="form__label" htmlFor='confirm-password'>
          Confirm Password
          <input
              type='password'
              id='confirm-password'
              value= {confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}/>
        </label>
        {registerError ? <label>{registerError}</label> : null}
        <button 
          className='primary' 
          type='submit' 
          disabled={!(email && username && password && confirmPassword)} 
          onClick={async (e) => {
            e.preventDefault();
            await onButtonClick();
          }}>
          <span>Sign In</span>
        </button>
      </Form>
    </main>
  );
}