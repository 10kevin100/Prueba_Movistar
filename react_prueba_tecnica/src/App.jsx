import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppContext } from "./Context/AppContext";
import { useContext } from "react";
import Layout from './Pages/Layout';
import Login from './Pages/login';
import Employee from './Pages/Employee/Employee';
import EmployeeCreate from './Pages/Employee/EmployeeCreate';
import EditEmployee from './Pages/Employee/EditEmployee';

export default function App() {
    const { user } = useContext(AppContext);
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={user ? <Layout /> : <Login />}>
                    <Route path="/employee" element={<Employee />} />
                    <Route path="/employee/create" element={<EmployeeCreate/>} />
                    <Route path="/employee/Edit/:id" element={<EditEmployee/>} />
                </Route>
                <Route path="/login" element={<Login />} />
            </Routes>
        </BrowserRouter>
    );
}