import { Box } from '@mui/material'
import { FC } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'

import Header from './components/Header'
import AnalyzeResponses from './pages/AnalyzeResponses'
import Auth from './pages/Auth'
import CreateTemplate from './pages/CreateTemplate'
import FillForm from './pages/FillForm'
import Home from './pages/Home'
import ViewForm from './pages/ViewForm'

const App: FC = () => {
  const { pathname } = useLocation()

  return (
    <Box className="flex min-h-screen flex-col">
      {pathname !== '/auth' && <Header />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<Auth />} />

        <Route path="/create-template" element={<CreateTemplate />} />

        <Route path="/view-form/:id" element={<ViewForm />} />
        <Route path="/fill-form/:id" element={<FillForm />} />
        <Route path="/analyze-responses/:id" element={<AnalyzeResponses />} />
      </Routes>
    </Box>
  )
}

export default App
