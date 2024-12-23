import { useState, useEffect, useContext } from "react";
import { AppContext } from "../../Context/AppContext";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencil, faTrash, faSort, faSortUp, faSortDown, faEye } from "@fortawesome/free-solid-svg-icons";

export default function ClientList() {
  const [clients, setClients] = useState([]);
  const [search, setSearch] = useState("");
  const { token } = useContext(AppContext);
  const [sortConfig, setSortConfig] = useState({ key: 'id', direction: 'asc' });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [clientToDelete, setClientToDelete] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [clientLogs, setClientLogs] = useState([]);
  const [selectedClientName, setSelectedClientName] = useState("");

  useEffect(() => {
    async function fetchClients() {
      try {
        const response = await fetch("/api/client", {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        const data = await response.json();

        if (response.ok) {
          setClients(data.clients || []);
        } else {
          console.error("Error fetching clients:", data.message || "Unknown error");
          if (response.status === 401) {
            setErrorMessage("Token de autenticación inválido o expirado. Por favor, inicia sesión nuevamente.");
          }
        }
      } catch (error) {
        console.error("Error:", error);
        setErrorMessage("Ocurrió un error al obtener los clientes.");
      }
    }

    if (token) {
      fetchClients();
    } else {
      setErrorMessage("No se encontró el token de autenticación.");
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

  const sortedClients = [...clients].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? 1 : -1;
    }
    return 0;
  });

  const filteredClients = sortedClients.filter((client) => {
    const searchLower = search.toLowerCase();
    return (
      client.id.toString().includes(searchLower) ||
      client.name.toLowerCase().includes(searchLower) ||
      client.lastName.toLowerCase().includes(searchLower) ||
      client.email.toLowerCase().includes(searchLower) ||
      client.phone.toString().includes(searchLower)
    );
  });

  const openModal = (client) => {
    setClientToDelete(client);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setClientToDelete(null);
  };

  const deactivateClient = async () => {
    if (!clientToDelete) return;
  
    try {
      const response = await fetch(`/api/client/${clientToDelete.id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
  
      const data = await response.json();
  
      if (response.ok) {
        setClients((prevClients) =>
          prevClients.map((client) => 
            client.id === clientToDelete.id 
              ? { ...client, is_active: false }
              : client
          )
        );
        setSuccessMessage("Cliente desactivado con éxito!");
        closeModal();
      } else {
        setErrorMessage(data.message || "Error desconocido al desactivar el cliente.");
      }
    } catch (error) {
      setErrorMessage("Ocurrió un error al desactivar el cliente.");
      console.error("Error:", error);
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

  const openLogModal = async (clientId, clientName) => {
    try {
      const response = await fetch(`/api/client/${clientId}/logs`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();

      if (response.ok) {
        setClientLogs(data.logs || []);
        setSelectedClientName(clientName);
        setIsLogModalOpen(true);
      } else {
        setErrorMessage("Error al cargar los logs del cliente");
      }
    } catch (error) {
      console.error("Error:", error);
      setErrorMessage("Error al obtener los logs del cliente");
    }
  };

  const formatValues = (values) => {
    if (!values) return "No hay datos";
    try {
      const parsed = typeof values === 'string' ? JSON.parse(values) : values;
      return Object.entries(parsed)
        .map(([key, value]) => {
          if (Array.isArray(value)) {
            return `${key}: ${JSON.stringify(value)}`;
          }
          return `${key}: ${value}`;
        })
        .join(', ');
    } catch (error) {
        console.error("Error:", error);
      return values;
    }
  };

  return (
    <div className="overflow-x-auto sm:rounded-lg max-w-7xl mx-auto mt-6">
      <div>
        <h1 className="text-center text-3xl m-3 font-bold">Lista de Clientes</h1>
      </div>

      <div className="flex justify-between items-center mb-4 mt-5">
        <button className="bg-green-500 text-white text-base px-4 py-2 my-2 rounded-md hover:bg-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-300 transition duration-300 ease-in-out">
          <Link to="/client/create" className="text-white">Agregar cliente</Link>
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
              onClick={() => handleSort('name')}
            >
              Nombre
              <FontAwesomeIcon icon={sortConfig.key === 'name' && sortConfig.direction === 'asc' ? faSortUp : sortConfig.key === 'name' && sortConfig.direction === 'desc' ? faSortDown : faSort} className="ml-2" />
            </th>
            <th
              scope="col"
              className="px-4 py-3 border-b cursor-pointer"
              onClick={() => handleSort('email')}
            >
              Correo
              <FontAwesomeIcon icon={sortConfig.key === 'email' && sortConfig.direction === 'asc' ? faSortUp : sortConfig.key === 'email' && sortConfig.direction === 'desc' ? faSortDown : faSort} className="ml-2" />
            </th>
            <th className="px-4 py-3 border-b">Teléfono</th>
            <th className="px-4 py-3 border-b">Direcciones</th>
            <th className="px-4 py-3 border-b">Documentos</th>
            <th className="px-4 py-3 border-b">Estado</th>
            <th className="px-4 py-3 border-b">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {filteredClients.map((client) => (
            <tr key={client.id} className="bg-white border-b dark:bg-white dark:border-gray-800 text-center text-base font-medium">
              <td className="px-2 py-2 border-b">{client.id}</td>
              <td className="px-2 py-4 border-b">{client.name} {client.lastName}</td>
              <td className="px-2 py-4 border-b">{client.email}</td>
              <td className="px-2 py-4 border-b">+503{client.phone}</td>
              <td className="px-2 py-4 border-b">
                {client.addresses && client.addresses.length > 0 ? (
                  <ul>
                    {client.addresses.map((address, index) => (
                      <li key={index}>
                        {address.address}, {address.country}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No hay direcciones</p>
                )}
              </td>
              <td className="px-2 py-4 border-b">
                {client.documents && client.documents.length > 0 ? (
                  <ul>
                    {client.documents.map((document, index) => (
                      <li key={index}>
                        {document.document_type}: {document.document_number}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No hay documentos</p>
                )}
              </td>
              <td
                className={`px-2 py-4 border-b ${client.is_active === 1 ? 'bg-green-500 text-white' : 'bg-red-500 text-white'} rounded`}
              >
                {client.is_active === 1 ? 'Activo' : 'Inactivo'}
              </td>
              <td className="px-2 py-4 border-b">
                <button className="bg-orange-500 text-white px-4 py-2 mx-2 rounded-md hover:bg-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-300 transition duration-300 ease-in-out">
                  <Link to={`/client/edit/${client.id}`}>
                    <FontAwesomeIcon icon={faPencil} />
                  </Link>
                </button>
                <button
                className="bg-blue-500 text-white px-4 py-2 mx-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300 transition duration-300 ease-in-out"
                onClick={() => openLogModal(client.id, `${client.name} ${client.lastName}`)}
                >
                <FontAwesomeIcon icon={faEye} />
                </button>
                {client.is_active === 1 && (
                  <button
                    className="bg-red-500 text-white px-4 py-2 mx-2 rounded-md hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-teal-300 transition duration-300 ease-in-out"
                    onClick={() => openModal(client)}
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                )}
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

      {isModalOpen && (
        <div className="fixed inset-0 flex justify-center items-center bg-gray-500 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h2 className="text-xl font-semibold mb-4">
              ¿Estás seguro de que deseas desactivar este cliente?
            </h2>
            <div className="flex justify-end">
              <button
                className="bg-gray-300 text-black px-4 py-2 rounded-md mr-2"
                onClick={closeModal}
              >
                Cancelar
              </button>
              <button
                className="bg-red-500 text-white px-4 py-2 rounded-md"
                onClick={deactivateClient}
              >
                Desactivar
              </button>
            </div>
          </div>
        </div>
      )}


    {isLogModalOpen && (
        <div className="fixed inset-0 flex justify-center items-center bg-gray-500 bg-opacity-50 overflow-y-auto">
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-4xl w-full m-4">
            <h2 className="text-xl font-semibold mb-4">
            Historial de cambios - {selectedClientName}
            </h2>
            <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
                <thead className="text-xs uppercase bg-gray-700 text-white">
                <tr>
                    <th className="px-4 py-3">Fecha</th>
                    <th className="px-4 py-3">Usuario</th>
                    <th className="px-4 py-3">Acción</th>
                    <th className="px-4 py-3">Valores Anteriores</th>
                    <th className="px-4 py-3">Valores Nuevos</th>
                </tr>
                </thead>
                <tbody>
                {clientLogs.map((log) => (
                    <tr key={log.id} className="border-b">
                    <td className="px-4 py-3">
                        {new Date(log.created_at).toLocaleString()}
                    </td>
                    <td className="px-4 py-3">ID: {log.user_id}</td>
                    <td className="px-4 py-3 capitalize">{log.action}</td>
                    <td className="px-4 py-3">{formatValues(log.old_values)}</td>
                    <td className="px-4 py-3">{formatValues(log.new_values)}</td>
                    </tr>
                ))}
                </tbody>
            </table>
            </div>
            <div className="flex justify-end mt-4">
            <button
                className="bg-gray-300 text-black px-4 py-2 rounded-md"
                onClick={() => setIsLogModalOpen(false)}
            >
                Cerrar
            </button>
            </div>
        </div>
        </div>
    )}
    </div>
  );
}