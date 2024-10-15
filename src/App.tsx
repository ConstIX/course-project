import { Box, CssBaseline } from '@mui/material'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import { FC, useState } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'

import Header from './components/header/Header'
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

  const darkTheme = createTheme({
    palette: {
      mode: 'dark',
      background: {
        default: '#252525',
        paper: '#252525'
      }
    }
  })

  const lightTheme = createTheme({
    palette: {
      mode: 'light'
    }
  })

  return (
    <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
      <CssBaseline />

      <Box className="flex min-h-screen flex-col">
        {pathname !== '/auth' && <Header isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />}

        <Routes>
          <Route path="/" element={<Home />} />

          <Route path="/auth" element={<Auth />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />

          <Route path="/create-template" element={<CreateTemplate />} />
          <Route path="/edit-template/:id" element={<EditTemplate />} />

          <Route path="/view-form/:id" element={<ViewForm />} />
          <Route path="/fill-form/:id" element={<FillForm />} />
          <Route path="/view-results/:id" element={<ViewResults />} />
        </Routes>
      </Box>
    </ThemeProvider>
  )
}

export default App
