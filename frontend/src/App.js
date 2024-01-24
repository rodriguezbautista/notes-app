import { Link, Outlet } from 'react-router-dom';
import './App.css';
import { useSession } from './hooks/useSession';
import { useEffect } from 'react';

function App() {
  const [isLogged, setIsLogged] = useSession(false)

  const url = process.env.REACT_APP_API_URL;

  useEffect(() => {
    fetch(url + '/validation', {
      credentials: 'include'
    })
      .then(res => {
        if (!res.ok){
          throw new Error('User not logged')
        }
        setIsLogged(true)
      })
      .catch(err => console.log(err));
  }, [url, setIsLogged])

  function logout(){
    fetch(url + '/logout', {
      credentials: 'include'
    })
      .then(async res => {
          if (!res.ok){
            throw new Error(await res.json())
          }
          setIsLogged(false);
        })
      .catch(err => console.log(err))
  }

  
  return (
    <>
      <header>
        <nav>
          <Link to='/' className='notes-btn'><h2>Home</h2></Link>
          {
            !isLogged ? 
            <>
              <Link to='/login' className='session-btn'><h2>Log in</h2></Link>
              <Link to='/signin' className='session-btn'><h2>Sign in</h2></Link>
            </>
            :
            <button onClick={logout} className='navbar-btn'><h2>Log Out</h2></button>
          }
        </nav>
      </header>
      <Outlet/>
    </>
  );
}

export default App;
