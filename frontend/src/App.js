import { Link, Outlet } from 'react-router-dom';
import './App.css';
import { useSession } from './hooks/useSession';
import { useEffect } from 'react';
import url from './utils/apiUrl'

function App() {
  const [isLogged, setIsLogged] = useSession()


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
  }, [setIsLogged])

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
        <nav className='header__navbar'>
          <h2 className='header__title'>Notes</h2>
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
