import { Box, CssBaseline } from '@mui/material'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import { FC, useState } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'

import Header from './components/header/Header'
import PrivateRoute from './components/PrivateRoute'
import Auth from './pages/Auth'
import CreateTemplate from './pages/CreateTemplate'
import Dashboard from './pages/Dashboard'
import EditTemplate from './pages/EditTemplate'
import FillForm from './pages/FillForm'
import Home from './pages/Home'
import Profile from './pages/Profile'
import ViewForm from './pages/ViewForm'
import ViewResults from './pages/ViewResults'

const App: FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(false)
  const { pathname } = useLocation()

  const theme = createTheme({
    palette: {
      mode: isDarkMode ? 'dark' : 'light',
      background: {
        default: isDarkMode ? '#252525' : '#fff',
        paper: isDarkMode ? '#252525' : '#fff'
      }
    }
  })

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      <Box className="flex min-h-screen flex-col">
        {pathname !== '/auth' && <Header isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />}

        <Routes>
          <Route path="/" element={<Home />} />

          <Route path="/auth" element={<Auth />} />
          <Route path="/dashboard" element={<PrivateRoute element={<Dashboard />} />} />
          <Route path="/profile" element={<PrivateRoute element={<Profile />} />} />

          <Route path="/create-template" element={<PrivateRoute element={<CreateTemplate />} />} />
          <Route path="/edit-template/:id" element={<PrivateRoute element={<EditTemplate />} />} />

          <Route path="/view-form/:id" element={<ViewForm />} />
          <Route path="/fill-form/:id" element={<PrivateRoute element={<FillForm />} />} />
          <Route path="/view-results/:id" element={<PrivateRoute element={<ViewResults />} />} />
        </Routes>
      </Box>
    </ThemeProvider>
  )
}

export default App
