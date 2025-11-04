import { Navigate, Route, Routes } from 'react-router-dom'

// Context imports
import { useAuth } from '../hooks/useAuth'

// Layout imports
import AuthLayout from '../components/auth/AuthLayout'
import Layout from '../components/common/Layout'

// Page imports
import Dashboard from '../pages/Dashboard'
import Exercise from '../pages/Exercise'
import Home from '../pages/Home'
import Login from '../pages/Login'
import Olympics from '../pages/Olympics'
import OlympicSections from '../pages/OlympicSections'
import Profile from '../pages/Profile'
import Register from '../pages/Register'
import SectionTests from '../pages/SectionTests'

const PrivateRoute = ({ children }) => {
	const { isAuthenticated, loading } = useAuth()

	if (loading) {
		return (
			<div className='min-h-screen flex items-center justify-center'>
				<div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600'></div>
			</div>
		)
	}

	return isAuthenticated ? children : <Navigate to='/login' />
}

const PublicRoute = ({ children }) => {
	const { isAuthenticated, loading } = useAuth()

	if (loading) {
		return (
			<div className='min-h-screen flex items-center justify-center'>
				<div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600'></div>
			</div>
		)
	}

	return !isAuthenticated ? children : <Navigate to='/home' />
}

const AppRoutes = () => {
	return (
		<Routes>
			<Route
				path='/login'
				element={
					<PublicRoute>
						<AuthLayout>
							<Login />
						</AuthLayout>
					</PublicRoute>
				}
			/>
			<Route
				path='/register'
				element={
					<PublicRoute>
						<AuthLayout>
							<Register />
						</AuthLayout>
					</PublicRoute>
				}
			/>
			<Route
				path='/dashboard'
				element={
					<PrivateRoute>
						<Layout>
							<Dashboard />
						</Layout>
					</PrivateRoute>
				}
			/>
			<Route
				path='/home'
				element={
					<PrivateRoute>
						<Layout>
							<Home />
						</Layout>
					</PrivateRoute>
				}
			/>
			<Route
				path='/profile'
				element={
					<PrivateRoute>
						<Layout>
							<Profile />
						</Layout>
					</PrivateRoute>
				}
			/>
			<Route
				path='/olympics'
				element={
					<PrivateRoute>
						<Layout>
							<Olympics />
						</Layout>
					</PrivateRoute>
				}
			/>
			<Route
				path='/olympics/:olympicId/sections'
				element={
					<PrivateRoute>
						<Layout>
							<OlympicSections />
						</Layout>
					</PrivateRoute>
				}
			/>
			<Route
				path='/olympics/:olympicId/sections/:sectionId/tests'
				element={
					<PrivateRoute>
						<Layout>
							<SectionTests />
						</Layout>
					</PrivateRoute>
				}
			/>
			<Route
				path='/exercise/:olympicId'
				element={
					<PrivateRoute>
						<Layout>
							<Exercise />
						</Layout>
					</PrivateRoute>
				}
			/>
			<Route path='/' element={<Navigate to='/home' />} />
			<Route path='*' element={<Navigate to='/home' />} />
		</Routes>
	)
}

export default AppRoutes
