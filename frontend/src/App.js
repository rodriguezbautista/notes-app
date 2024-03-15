import { Link, Outlet, useNavigate } from 'react-router-dom';
import './App.css';
import { useSession } from './hooks/useSession';
import React, { useEffect } from 'react';
import url from './utils/apiUrl';

function App() {
	const [isLogged, setIsLogged] = useSession();
	const navigate = useNavigate();

	useEffect(() => {
		fetch(url + '/sessionValidation', {
			credentials: 'include',
		}).then(res => {
			if (res.ok) {
				setIsLogged(true);
			}
		});
	}, [setIsLogged]);

	function logout() {
		fetch(url + '/logout', {
			credentials: 'include',
		})
			.then(async res => {
				if (!res.ok) {
					throw new Error(await res.json());
				}
				setIsLogged(false);
			})
			.catch(err => console.log(err));
		navigate('/');
	}

	return (
		<>
			<header>
				<nav className="header__navbar">
					<Link to={isLogged ? '/notes' : '/'} className="header__title">
						<span>Note It Down</span>
					</Link>
					{!isLogged ? (
						<>
							<Link to="/login" className="navbar-btn">
								Log in
							</Link>
							<Link to="/signin" className="navbar-btn">
								Sign in
							</Link>
						</>
					) : (
						<>
							<Link to="/notes" className="navbar-btn">
								Notes
							</Link>
							<button onClick={logout} className="navbar-btn">
								Log Out
							</button>
						</>
					)}
				</nav>
			</header>
			<main className="app">
				<Outlet />
			</main>
		</>
	);
}

export default App;
