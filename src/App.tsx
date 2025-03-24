import { createBrowserRouter, RouterProvider } from 'react-router'

import './App.scss'
import FullScreenLayout from './layouts/FullScreenLayout'

import Login from './pages/Auth/Login/Login'
import Register from './pages/Auth/Register/Register'
import VerifyEmail from './pages/Auth/VerifyEmail/VerifyEmail'

import HomePage from './pages/Home/Home'
import ForgotPasswordLink from './pages/Auth/ForgotPasswordLink/ForgotPasswordLink'
import ResetPassword from './pages/Auth/ForgotPasswordLink/ResetPassword'
import ProfilePage from './pages/Profile/Profile'
import AllProducts from './pages/Products/AllProducts'
import SingleProduct from './pages/Products/SingleProduct'

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
			{
                path: '/auth/password-reset-dialog',
                element: <ForgotPasswordLink />,
            },
			{
                path: '/auth/reset-password/:id/:token',
                element: <ResetPassword />,
            },
			{
                path: '/profile',
                element: <ProfilePage />,
            },
			{
                path: '/products/vl',
                element: <AllProducts />,
            },
			{
                path: '/products/:slug',
                element: <SingleProduct />,
            },
			{
                path: '/products/vl/:category',
                element: <AllProducts />,
            },
			{
                path: '/products/:category/:slug',
                element: <SingleProduct />,
            },
			{
                path: '/products/vl/:category/:subCategory',
                element: <AllProducts />,
            },
			{
                path: '/products/:category/:subCategory/:slug',
                element: <SingleProduct />,
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
