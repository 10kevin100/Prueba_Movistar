import { useState, useEffect, useContext } from "react";
import { AppContext } from "../../Context/AppContext";
import * as XLSX from "xlsx";

export default function ClientLogReportPage() {
    const [clients, setClients] = useState([]);
    const [selectedClient, setSelectedClient] = useState(null); // Cliente seleccionado
    const [loading, setLoading] = useState(true);
    const { token } = useContext(AppContext);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        async function fetchClients() {
            setLoading(true);
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
                    const transformedClients = data.clients.map(client => {
                        const addresses = client.addresses.map((address, index) => ({
                            [`Dirección ${index + 1}`]: address.address,
                            [`Código Postal ${index + 1}`]: address.postal_code,
                            [`País ${index + 1}`]: address.country
                        }));
                        const documents = client.documents.map((document, index) => ({
                            [`Tipo de Documento ${index + 1}`]: document.document_type,
                            [`Número de Documento ${index + 1}`]: document.document_number
                        }));
                        return {
                            "ID Cliente": client.id,
                            "Nombre": client.name,
                            "Apellido": client.lastName,
                            "Correo Electrónico": client.email,
                            "Teléfono": client.phone,
                            "Activo": client.is_active ? "Sí" : "No",
                            "Fecha de Creación": client.created_at,
                            "Fecha de Actualización": client.updated_at,
                            ...addresses.reduce((acc, cur) => ({ ...acc, ...cur }), {}),
                            ...documents.reduce((acc, cur) => ({ ...acc, ...cur }), {})
                        };
                    });

                    setClients(transformedClients);
                } else {
                    console.error("Error fetching clients:", data.message || "Unknown error");
                    if (response.status === 401) {
                        setErrorMessage("Token de autenticación inválido o expirado. Por favor, inicia sesión nuevamente.");
                    }
                }
            } catch (error) {
                console.error("Error:", error);
                setErrorMessage("Ocurrió un error al obtener los clientes.");
            } finally {
                setLoading(false);
            }
        }

        if (token) {
            fetchClients();
        } else {
            setErrorMessage("No se encontró el token de autenticación.");
            setLoading(false);
        }
    }, [token]);

    // Función para generar el archivo .xlsx para todos los clientes o un solo cliente
    const generateReport = () => {
        // Si no hay clientes, no generar el reporte
        if (!clients || clients.length === 0) {
            alert("No hay clientes para generar el reporte.");
            return;
        }

        // Convertir selectedClient a número (en caso de que sea string) para comparar correctamente con los IDs de los clientes
        const selectedClientId = selectedClient ? parseInt(selectedClient, 10) : null;

        // Si se seleccionó un solo cliente, obtenerlo
        const clientsToExport = selectedClientId
            ? [clients.find(client => client["ID Cliente"] === selectedClientId)] 
            : clients;

        // Si no se encontró el cliente seleccionado
        if (selectedClientId && !clientsToExport[0]) {
            alert("Cliente no encontrado.");
            return;
        }

        // Crear la hoja de trabajo con los datos de los clientes
        const ws = XLSX.utils.json_to_sheet(clientsToExport);

        // Crear el libro de trabajo
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Clientes");

        // Descargar el archivo
        const fileName = selectedClientId ? `Reporte_Cliente_${selectedClientId}.xlsx` : "Reporte_Todos_Los_Clientes.xlsx";
        XLSX.writeFile(wb, fileName);
    };

    if (loading) {
        return <div>Cargando clientes...</div>;
    }

    return (
<div className="p-6 bg-white rounded-lg shadow-md max-w-lg mx-auto m-6">
    <h1 className="text-2xl font-semibold mb-6 text-center">Generar Reporte de Clientes</h1>

    {/* Selector de cliente (si se desea generar el reporte de un solo cliente) */}
    <div className="mb-4">
        <label htmlFor="clientSelect" className="block text-lg font-medium mb-2">
            Selecciona un Cliente:
        </label>
        <select
            id="clientSelect"
            value={selectedClient || ""}
            onChange={e => setSelectedClient(e.target.value || null)}
            className="block w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        >
            <option value="">Todos los clientes</option>
            {clients.map(client => (
                <option key={client["ID Cliente"]} value={client["ID Cliente"]}>
                    {client.Nombre} {client.Apellido}
                </option>
            ))}
        </select>
    </div>

    {/* Botón para generar el reporte */}
    <div>
        <button
            onClick={generateReport}
            className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-6 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
        >
            Generar Reporte
        </button>
    </div>

    {/* Mensaje cuando no hay clientes */}
    {clients.length === 0 && (
        <p className="mt-4 text-red-500 font-medium text-center">No hay clientes disponibles para generar el reporte.</p>
    )}

    {/* Mensaje de error */}
    {errorMessage && (
        <p className="mt-4 text-red-500 font-medium text-center">{errorMessage}</p>
    )}
</div>
    );
}
