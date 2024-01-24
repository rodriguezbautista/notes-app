import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import './index.css';
import router from "./router";
import { SessionProvider } from './hooks/useSession';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <SessionProvider>
        <RouterProvider router={router}/>
    </SessionProvider>
);
