import { Link, Outlet } from 'react-router-dom';
import './App.css';
import { useSession } from './hooks/useSession';
import React, { useEffect } from 'react';
import url from './utils/apiUrl';

function App() {
	const [isLogged, setIsLogged] = useSession() as [boolean, React.Dispatch<React.SetStateAction<boolean>>];

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
	}

	return (
		<>
			<header>
				<nav className="header__navbar">
					<Link to="/" className="header__title">
						<h2>Note Them Down</h2>
					</Link>
					{!isLogged ? (
						<>
							<Link to="/login" className="session-btn">
								<h2>Log in</h2>
							</Link>
							<Link to="/signin" className="session-btn primary">
								<h2>Sign in</h2>
							</Link>
						</>
					) : (
						<>
							<Link to="/Notes" className="session-btn">
								<h2>Notes</h2>
							</Link>
							<button onClick={logout} className="navbar-btn secondary">
								<h2>Log Out</h2>
							</button>
						</>
					)}
				</nav>
			</header>
			<Outlet />
		</>
	);
}

export default App;
