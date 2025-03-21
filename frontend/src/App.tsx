import './App.css';
import { SpeakingPractice } from './components/SpeakingPractice.tsx';
import { ContentManagement } from './components/ContentManagement.tsx';
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useLocation,
} from 'react-router-dom';
import { Button } from '@fluentui/react-components';

function Navigation() {
  const location = useLocation();
  return (
    <nav className="bg-slate-800 p-4">
      <div className="flex justify-center space-x-4 text-gray-50">
        <Link to="/">
          <Button
            appearance={location.pathname === '/' ? 'primary' : 'secondary'}
            className="text-white"
          >
            表达练习
          </Button>
        </Link>
        <Link to="/content-management">
          <Button
            appearance={
              location.pathname === '/content-management'
                ? 'primary'
                : 'secondary'
            }
            className="text-white"
          >
            内容管理
          </Button>
        </Link>
      </div>
    </nav>
  );
}

function App() {
  return (
    <BrowserRouter>
      <div id="App" className="flex flex-col min-h-screen">
        <Navigation />
        <div className="flex-1 flex justify-center items-center">
          <Routes>
            <Route path="/" element={<SpeakingPractice />} />
            <Route path="/content-management" element={<ContentManagement />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
