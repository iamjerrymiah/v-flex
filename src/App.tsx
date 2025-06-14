import { createBrowserRouter, RouterProvider } from 'react-router'

import './App.scss'
import FullScreenLayout from './layouts/FullScreenLayout'

import Login from './pages/Auth/Login/Login'
import Register from './pages/Auth/Register/Register'
import VerifyEmail from './pages/Auth/VerifyEmail/VerifyEmail'
import ForgotPasswordLink from './pages/Auth/ForgotPasswordLink/ForgotPasswordLink'
import ResetPassword from './pages/Auth/ForgotPasswordLink/ResetPassword'

import HomePage from './pages/Home/Home'
import AllProducts from './pages/Products/AllProducts'
import SingleProduct from './pages/Products/SingleProduct'
import CartPage from './pages/Cart/Cart'
import WaitListPage from './pages/WaitList/WaitList'

import ProfilePage from './pages/Profile/Profile'
import MyOrderPage from './pages/Order/MyOrder'

import OrderPage from './pages/Order/Order'
import ContactPage from './pages/Contact/Contact'
import AdminProductPage from './pages/Products/AdminProductPage'
import AdminUserPage from './pages/Admin/AdminUserPage'
import MyAddressBook from './pages/Profile/MyAddressBook'
import AccountDetails from './pages/Profile/AccountDetails'
import AdminCreateProductPage from './pages/Products/AdminCreateProductPage'
import AdminCategoryPage from './pages/Admin/AdminCategoryPage'
import AdminEditProductPage from './pages/Products/AdminEditProductPage'

const router = createBrowserRouter([
	{
		path: '/',
		element: <FullScreenLayout />,
		errorElement: <></>,
		children: [
			{
				index: true,
				path: '/',
				element: <HomePage />,
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
                path: '/contact-us',
                element: <ContactPage />,
            },
            {
                path: '/my-cart',
                element: <CartPage />,
            },
            {
                path: '/my-wishlist',
                element: <WaitListPage />,
            },
            {
                path: '/profile/my-orders',
                element: <MyOrderPage />,
            },
            {
                path: '/profile/address-book',
                element: <MyAddressBook />,
            },
            {
                path: '/profile/account-details',
                element: <AccountDetails />,
            },
			{
                path: '/products/vl',
                element: <AllProducts />,
            },
			{
                path: '/products/:slug',
                element: <SingleProduct />,
            },
			// {
            //     path: '/products/vl/:category',
            //     element: <AllProducts />,
            // },
			// {
            //     path: '/products/:category/:slug',
            //     element: <SingleProduct />,
            // },
			// {
            //     path: '/products/vl/:category/:subCategory',
            //     element: <AllProducts />,
            // },
			// {
            //     path: '/products/:category/:subCategory/:slug',
            //     element: <SingleProduct />,
            // },
            {
                path: '/vl/admin/orders',
                element: <OrderPage />,
            },
            {
                path: '/vl/admin/categories',
                element: <AdminCategoryPage />,
            },
            {
                path: '/vl/admin/products',
                element: <AdminProductPage />,
            },
            {
                path: '/vl/admin/products/create',
                element: <AdminCreateProductPage />,
            },
            {
                path: '/vl/admin/products/:id',
                element: <AdminEditProductPage />,
            },
            {
                path: '/vl/admin/users',
                element: <AdminUserPage />,
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
