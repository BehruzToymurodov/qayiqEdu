import React, { createContext, useContext, useEffect, useState } from 'react'

const AuthContext = createContext()

export const useAuthContext = () => {
	const context = useContext(AuthContext)
	if (!context) {
		throw new Error('useAuthContext must be used within an AuthProvider')
	}
	return context
}

export const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(null)
	const [isAuthenticated, setIsAuthenticated] = useState(false)
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		// Check if user is already logged in
		const token = localStorage.getItem('token')
		if (token) {
			// Mock user data for demo
			setUser({
				id: 1,
				firstName: 'Bekhruz',
				lastName: 'Tuymuradov',
				username: 'bekhruz_tuymuradov',
				email: 'bekhruz@qayiqedu.uz',
				role: 'Moderator',
				avatar: '/api/placeholder/100/100',
			})
			setIsAuthenticated(true)
		}
		setLoading(false)
	}, [])

	const login = async credentials => {
		try {
			// Mock login - replace with real API call
			if (
				credentials.username === 'admin' &&
				credentials.password === 'admin'
			) {
				const userData = {
					id: 1,
					firstName: 'Bekhruz',
					lastName: 'Tuymuradov',
					username: 'bekhruz_tuymuradov',
					email: 'bekhruz@qayiqedu.uz',
					role: 'Moderator',
					avatar: '/api/placeholder/100/100',
				}

				setUser(userData)
				setIsAuthenticated(true)
				localStorage.setItem('token', 'mock_jwt_token')
				return { success: true }
			} else {
				return { success: false, error: "Noto'g'ri login yoki parol" }
			}
		} catch (error) {
			return { success: false, error: error.message }
		}
	}

	const register = async userData => {
		try {
			// Mock register
			const newUser = {
				id: Date.now(),
				firstName: userData.firstName,
				lastName: userData.lastName,
				username: userData.username,
				email: userData.email || '',
				role: userData.role,
				avatar: '/api/placeholder/100/100',
			}

			setUser(newUser)
			setIsAuthenticated(true)
			localStorage.setItem('token', 'mock_jwt_token_' + Date.now())
			return { success: true }
		} catch (error) {
			return { success: false, error: error.message }
		}
	}

	const logout = () => {
		setUser(null)
		setIsAuthenticated(false)
		localStorage.removeItem('token')
	}

	const updateUser = updatedUser => {
		setUser(updatedUser)
	}

	const value = {
		user,
		isAuthenticated,
		loading,
		login,
		register,
		logout,
		updateUser,
	}

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
