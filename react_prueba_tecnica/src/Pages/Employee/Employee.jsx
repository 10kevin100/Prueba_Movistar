import { useState, useEffect, useContext } from "react";
import { AppContext } from "../../Context/AppContext";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencil, faTrash, faSort, faSortUp, faSortDown } from "@fortawesome/free-solid-svg-icons";

export default function Employee() {
  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState("");
  const { token } = useContext(AppContext);
  const [sortConfig, setSortConfig] = useState({ key: 'id', direction: 'asc' });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function fetchEmployees() {
      try {
        const response = await fetch("/api/employee", {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        const data = await response.json();

        if (response.ok) {
          setEmployees(data.employees || []);
        } else {
          console.error("Error fetching employees:", data.message || "Unknown error");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    }

    if (token) {
      fetchEmployees();
    }
  }, [token]);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedEmployees = [...employees].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? 1 : -1;
    }
    return 0;
  });

  const filteredEmployees = sortedEmployees.filter((employee) => {
    const searchLower = search.toLowerCase();
    return (
      employee.id.toString().includes(searchLower) ||
      employee.user.name.toLowerCase().includes(searchLower) ||
      employee.user.email.toLowerCase().includes(searchLower) ||
      employee.job_title.toLowerCase().includes(searchLower) ||
      employee.joined_at.toLowerCase().includes(searchLower)
    );
  });

  const openModal = (employee) => {
    setEmployeeToDelete(employee);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEmployeeToDelete(null);
  };

  const deleteEmployee = async () => {
    if (!employeeToDelete) return;
  
    try {
      const response = await fetch(`/api/employee/${employeeToDelete.id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
  
      const data = await response.json();
  
      if (response.ok) {
        setEmployees((prevEmployees) =>
          prevEmployees.filter((emp) => emp.id !== employeeToDelete.id)
        );
        setSuccessMessage("Empleado eliminado con éxito!");
        closeModal();
        setTimeout(() => {
          setSuccessMessage("");
        }, 3000);
      } else {
        setErrorMessage(data.message || "Error desconocido al eliminar el empleado.");
        setTimeout(() => {
          setErrorMessage("");
        }, 3000);
      }
    } catch (error) {
      setErrorMessage("Ocurrió un error al eliminar el empleado.");
      console.error("Error:", error);
      setTimeout(() => {
        setErrorMessage("");
      }, 3000);
    }
  };
  
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [successMessage]);
  
  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => {
        setErrorMessage("");
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [errorMessage]);

  return (
    <div className="overflow-x-auto sm:rounded-lg max-w-7xl mx-auto mt-6">
      <div>
        <h1 className="text-center text-3xl m-3 font-bold">Gestión de empleados</h1>
      </div>

      <div className="flex justify-between items-center mb-4 mt-5">
        <button className="bg-green-500 text-white text-base px-4 py-2 my-2 rounded-md hover:bg-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-300 transition duration-300 ease-in-out">
          <Link to="/employee/create" className="text-white">Agregar empleado</Link>
        </button>

        <input
          type="text"
          value={search}
          onChange={handleSearchChange}
          className="w-72 p-2 border border-gray-300 rounded-md"
          placeholder="Buscar..."
        />
      </div>

      <table className="w-full text-sm text-center text-white dark:text-gray-700">
        <thead className="text-xs text-center text-white uppercase bg-gray-300 dark:bg-gray-600 dark:text-gray-400">
          <tr className="text-white text-base bg-slate-700">
            <th
              scope="col"
              className="px-4 py-3 border-b cursor-pointer"
              onClick={() => handleSort('id')}
            >
              ID
              <FontAwesomeIcon icon={sortConfig.key === 'id' && sortConfig.direction === 'asc' ? faSortUp : sortConfig.key === 'id' && sortConfig.direction === 'desc' ? faSortDown : faSort} className="ml-2" />
            </th>
            <th
              scope="col"
              className="px-4 py-3 border-b cursor-pointer"
              onClick={() => handleSort('user.name')}
            >
              Nombre
              <FontAwesomeIcon icon={sortConfig.key === 'user.name' && sortConfig.direction === 'asc' ? faSortUp : sortConfig.key === 'user.name' && sortConfig.direction === 'desc' ? faSortDown : faSort} className="ml-2" />
            </th>
            <th
              scope="col"
              className="px-4 py-3 border-b cursor-pointer"
              onClick={() => handleSort('user.email')}
            >
              Email
              <FontAwesomeIcon icon={sortConfig.key === 'user.email' && sortConfig.direction === 'asc' ? faSortUp : sortConfig.key === 'user.email' && sortConfig.direction === 'desc' ? faSortDown : faSort} className="ml-2" />
            </th>
            <th
              scope="col"
              className="px-4 py-3 border-b cursor-pointer"
              onClick={() => handleSort('job_title')}
            >
              Cargo
              <FontAwesomeIcon icon={sortConfig.key === 'job_title' && sortConfig.direction === 'asc' ? faSortUp : sortConfig.key === 'job_title' && sortConfig.direction === 'desc' ? faSortDown : faSort} className="ml-2" />
            </th>
            <th
              scope="col"
              className="px-4 py-3 border-b cursor-pointer"
              onClick={() => handleSort('joined_at')}
            >
              Fecha de Ingreso
              <FontAwesomeIcon icon={sortConfig.key === 'joined_at' && sortConfig.direction === 'asc' ? faSortUp : sortConfig.key === 'joined_at' && sortConfig.direction === 'desc' ? faSortDown : faSort} className="ml-2" />
            </th>
            <th scope="col" className="px-4 py-3 border-b">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {filteredEmployees && Array.isArray(filteredEmployees) && filteredEmployees
            .filter((employee) => employee.user.role === "employee")
            .map((employee) => (
              <tr key={employee.id} className="bg-white border-b dark:bg-white dark:border-gray-800 text-center text-base font-medium">
                <td className="px-2 py-2 border-b">{employee.id}</td>
                <td className="px-2 py-4 border-b">{employee.user.name}</td>
                <td className="px-2 py-4 border-b">{employee.user.email}</td>
                <td className="px-2 py-4 border-b">{employee.job_title}</td>
                <td className="px-2 py-4 border-b">{employee.joined_at}</td>
                <td className="px-2 py-4 border-b">
                  <button
                    className="bg-orange-500 text-white px-4 py-2 mx-2 rounded-md hover:bg-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-300 transition duration-300 ease-in-out"
                  >
                  <Link to={`/employee/edit/${employee.id}`}><FontAwesomeIcon icon={faPencil} /></Link>
                  </button>
                  <button
                    className="bg-red-500 text-white px-4 py-2 mx-2 rounded-md hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-teal-300 transition duration-300 ease-in-out"
                    onClick={() => openModal(employee)}
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>

      {successMessage && (
        <div
          className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white text-center py-2 px-4 rounded-md shadow-lg max-w-xs w-full transition-all duration-300 ease-in-out opacity-0 animate-fadeIn"
          style={{ transition: 'opacity 0.5s ease-in-out' }}
        >
          {successMessage}
        </div>
      )}

      {errorMessage && (
        <div
          className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-red-500 text-white text-center py-2 px-4 rounded-md shadow-lg max-w-xs w-full transition-all duration-300 ease-in-out opacity-0 animate-fadeIn"
          style={{ transition: 'opacity 0.5s ease-in-out' }}
        >
          {errorMessage}
        </div>
      )}
      
      {/* Modal de Eliminación */}
      {isModalOpen && (
        <div className="fixed inset-0 flex justify-center items-center bg-gray-500 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h2 className="text-xl font-semibold mb-4">¿Estás seguro de que deseas eliminar este empleado?</h2>
            <div className="flex justify-end">
              <button
                className="bg-gray-300 text-black px-4 py-2 rounded-md mr-2"
                onClick={closeModal}
              >
                Cancelar
              </button>
              <button
                className="bg-red-500 text-white px-4 py-2 rounded-md"
                onClick={deleteEmployee}
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
