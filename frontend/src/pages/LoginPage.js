import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSession } from '../hooks/useSession';
import url from '../utils/apiUrl';

export default function LoginPage() {
	const [loginError, setLoginError] = useState('');
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [, setIsLogged] = useSession();
	const navigate = useNavigate();

	async function onButtonClick() {
		try {
			setLoginError('');
			const res = await fetch(url + '/login', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					username,
					password,
				}),
				credentials: 'include',
			});
			if (res.ok) {
				setIsLogged(true);
				navigate('/notes');
			} else setLoginError('Wrong username or password');
		} catch (err) {
			console.log(err);
			setLoginError(err.name + ' ' + err.message);
		}
	}

	return (
		<main className="container form-container">
			<form className="session__form">
				<label className="form__label" htmlFor="username">
					Username
					<input
						type="text"
						id="username"
						value={username}
						onChange={e => setUsername(e.target.value)}
					/>
				</label>
				<label className="form__label" htmlFor="password">
					Password
					<input
						type="password"
						id="password"
						value={password}
						onChange={e => setPassword(e.target.value)}
					/>
				</label>
				{loginError ? <label>{loginError}</label> : null}
				<button
					className="form__submit primary"
					onClick={async e => {
						e.preventDefault();
						onButtonClick();
					}}>
					Log In
				</button>
			</form>
		</main>
	);
}
