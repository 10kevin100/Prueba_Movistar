import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppContext } from "./Context/AppContext";
import { useContext } from "react";
import ReactLoading from 'react-loading';
import Layout from './Pages/Layout';
import Login from './Pages/login';
import Employee from './Pages/Employee/Employee';
import EmployeeCreate from './Pages/Employee/EmployeeCreate';
import EditEmployee from './Pages/Employee/EditEmployee';
import ClientList from './Pages/Clients/Client';
import CreateClient from './Pages/Clients/CreateClient';
import EditClient from './Pages/Clients/EditClient';
import ClientLogReportPage from './Pages/Reports/ClientLogReport';

export default function App() {
  const { user, isLoading } = useContext(AppContext);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <ReactLoading type="spin" color="#00BFFF" height={50} width={50} />
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={user ? <Layout /> : <Login />}>
          <Route path="/employee" element={<Employee />} />
          <Route path="/employee/create" element={<EmployeeCreate />} />
          <Route path="/employee/Edit/:id" element={<EditEmployee />} />
          <Route path="/client" element={<ClientList />} />
          <Route path="/client/create" element={<CreateClient />} />
          <Route path="/client/Edit/:id" element={<EditClient />} />
          <Route path="/client/logs" element={<ClientLogReportPage />} />
        </Route>
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}