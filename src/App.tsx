import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import ExerciseLibrary from './pages/ExerciseLibrary'
import Routines from './pages/Routines'
import RoutineEditor from './pages/RoutineEditor'
import ActiveWorkout from './pages/ActiveWorkout'
import WorkoutHistory from './pages/WorkoutHistory'
import WorkoutDetail from './pages/WorkoutDetail'
import Progress from './pages/Progress'
import Settings from './pages/Settings'

function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/exercises" element={<ExerciseLibrary />} />
          <Route path="/routines" element={<Routines />} />
          <Route path="/routines/new" element={<RoutineEditor />} />
          <Route path="/routines/:id/edit" element={<RoutineEditor />} />
          <Route path="/workout" element={<ActiveWorkout />} />
          <Route path="/history" element={<WorkoutHistory />} />
          <Route path="/history/:id" element={<WorkoutDetail />} />
          <Route path="/progress" element={<Progress />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
