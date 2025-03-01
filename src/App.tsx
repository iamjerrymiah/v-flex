import { createBrowserRouter, RouterProvider } from 'react-router'

import './App.scss'
import FullScreenLayout from './layouts/FullScreenLayout'

import Login from './pages/Auth/Login/Login'
import Register from './pages/Auth/Register/Register'
import VerifyEmail from './pages/Auth/VerifyEmail/VerifyEmail'

import HomePage from './pages/Home/Home'

const router = createBrowserRouter([
	{
		path: '/',
		element: <FullScreenLayout />,
		errorElement: <></>,
		children: [
			{
				index: true,
				path: '/',
				element: <HomePage />
			},
            {
                path: '/login',
                element: <Login />,
            },
            {
                path: '/register',
                element: <Register />,
            },
			{
                path: '/auth/verify',
                element: <VerifyEmail />,
            },
		]
	}
])

function App() {

	return (
		<>
			<RouterProvider router={router} />
		</>
	)
}

export default App
