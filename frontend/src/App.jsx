
import { BrowserRouter as Router,Routes, Route } from 'react-router'
import UploadPage from './pages/UploadPage';
import HomePage from './pages/Home';


function App() {
  return (
    <Router>
     <Routes>
     <Route path="/" element={<HomePage />}></Route>
      <Route path="/upload" element={<UploadPage />}></Route>
     </Routes>
    </Router>
  )
}
export default App;
