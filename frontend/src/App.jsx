
import { BrowserRouter as Router,Routes, Route } from 'react-router'
import UploadPage from './pages/UploadPage';
import HomePage from './pages/Home';
import Login from './pages/Login';

function App() {
  return (
    <Router>
     <Routes>
     <Route path="/" element={<HomePage />}></Route>
      <Route path="/upload" element={<UploadPage />}></Route>
      <Route path="/login" element={<Login/>}></Route>
     </Routes>
    </Router>
  )
}
export default App;
