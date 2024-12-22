import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppContext } from "./Context/AppContext";
import { useContext } from "react";
import Layout from './Pages/Layout';
import Login from './Pages/login';

export default function App() {
  const { user, role } = useContext(AppContext);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={user ? <Layout /> : <Login />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}