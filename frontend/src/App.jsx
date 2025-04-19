
import { BrowserRouter as Router,Routes, Route } from 'react-router'
import UploadPage from './pages/UploadPage';
import HomePage from './pages/Home';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Dashboard from './pages/Dasboard';

function App() {
  return (
    <Router>
     <Routes>
     <Route path="/" element={<HomePage />}></Route>
      <Route path="/upload" element={<UploadPage />}></Route>
      <Route path="/login" element={<Login/>}></Route>
      <Route path="/signup" element={<SignUp/>}></Route>
      <Route path="/dashboard" element={<Dashboard/>}></Route>
     </Routes>
    </Router>
  )
}
export default App;
