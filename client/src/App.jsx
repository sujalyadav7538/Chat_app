/* eslint-disable react/prop-types */
import  { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Auth from './pages/auth';
import { Chat } from './pages/chat';
import { Profile } from './pages/profile';
import { userStore } from '@/store'; 

const PrivateRoute = ({ children }) => {
  const userinfo = userStore((state) => state.userinfo);
  return userinfo==null ? <Navigate to="/auth" /> : children;
};

const AuthRoute = ({ children }) => {
  const userinfo = userStore((state) => state.userinfo);
  return userinfo==null ? children :<Navigate to="/profile" /> ;
};

const App = () => {
  const { userinfo,setUserInfo } = userStore();

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await fetch('http://localhost:8747/auth/userinfo', {
          method: "GET",
          headers: {
            'Content-Type': 'application/json'
          },
          credentials: "include"
        });

        if (response.ok) {
          const data = await response.json();
          setUserInfo(data);
        } else {
          console.error('Failed to fetch user info');
          setUserInfo(null)
          
        }
      } catch (error) {
        console.error('Error fetching user info:', error);
        setUserInfo(null)
      }
    };

    fetchUserInfo();

    // Setup a timer to refresh user info periodically
    const timer = setInterval(() => {
      fetchUserInfo();
    }, 30 * 60 * 1000); // 30 minutes

    // Clear the interval on component unmount
    return () => clearInterval(timer);
  }, [setUserInfo]); // Dependency on stable `setUserInfo` function
  
  if (userinfo === undefined) {
    return <div>Loading...</div>;
  }
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth" element={<AuthRoute><Auth /></AuthRoute>} />
        <Route path="/chat" element={<PrivateRoute><Chat /></PrivateRoute>} />
        <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
        <Route path="*" element={<Auth />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
