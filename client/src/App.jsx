/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Auth from './pages/auth';
import {Chat} from './pages/chat';
import {Profile} from './pages/profile';
import { userStore } from '@/store'; 

const PrivateRoute = ({ children }) => {
  const userinfo = userStore((state) => state.userinfo);
  return userinfo===undefined ? <Navigate to="/auth" /> :children ;
};

const AuthRoute = ({ children }) => {
  const userinfo = userStore((state) => state.userinfo);
  return userinfo===undefined ?  children: <Navigate to="/profile"/>;
};

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="*" element={<Auth/>} />
        <Route path="/auth" element={<AuthRoute><Auth /></AuthRoute>} />
        <Route path="/chat" element={<PrivateRoute><Chat /></PrivateRoute>} />
        <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
