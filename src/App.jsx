import React from 'react'
import { BrowserRouter as Router } from 'react-router-dom'

// Context imports
import { AuthProvider } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'

// Routes
import 'katex/dist/katex.min.css'
import AppRoutes from './routes/AppRoutes'

function App() {
	return (
		<ThemeProvider>
			<AuthProvider>
				<Router>
					<div className='App'>
						<AppRoutes />
					</div>
				</Router>
			</AuthProvider>
		</ThemeProvider>
	)
}

export default App
