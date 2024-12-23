import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppContext } from "./Context/AppContext";
import { useContext } from "react";
import Layout from './Pages/Layout';
import Login from './Pages/login';
import Employee from './Pages/Employee/Employee';
import EmployeeCreate from './Pages/Employee/EmployeeCreate';
import EditEmployee from './Pages/Employee/EditEmployee';
import ClientList from './Pages/Clients/Client';
import CreateClient from './Pages/Clients/CreateClient';
import EditClient from './Pages/Clients/EditClient';

export default function App() {
    const { user } = useContext(AppContext);
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={user ? <Layout /> : <Login />}>
                    <Route path="/employee" element={<Employee />} />
                    <Route path="/employee/create" element={<EmployeeCreate/>} />
                    <Route path="/employee/Edit/:id" element={<EditEmployee/>} />
                    <Route path="/client" element={<ClientList/>} />
                    <Route path="/client/create" element={<CreateClient/>}/>
                    <Route path="/client/Edit/:id" element= {<EditClient/>}/>
                </Route>
                <Route path="/login" element={<Login />} />
            </Routes>
        </BrowserRouter>
    );
}