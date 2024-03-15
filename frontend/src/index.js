import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { SessionProvider } from './hooks/useSession';
import { RouterProvider } from 'react-router-dom';
import router from './router';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
	<SessionProvider>
		<RouterProvider router={router} />
	</SessionProvider>,
);
