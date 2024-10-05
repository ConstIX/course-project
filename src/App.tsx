import { Box } from '@mui/material'
import { FC } from 'react'
import { Route, Routes } from 'react-router-dom'

import AnalyzeResponses from './pages/AnalyzeResponses'
import CreateTemplate from './pages/CreateTemplate'
import FillForm from './pages/FillForm'
import Home from './pages/Home'

const App: FC = () => {
  return (
    <Box className="flex min-h-screen flex-col">
      <Box className="mx-auto w-full max-w-[1400px] px-3">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/create-template" element={<CreateTemplate />} />
          <Route path="/fill-form/:id" element={<FillForm />} />
          <Route path="/analyze-responses/:id" element={<AnalyzeResponses />} />
        </Routes>
      </Box>
    </Box>
  )
}

export default App
