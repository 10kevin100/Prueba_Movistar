import { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppContext } from "../../Context/AppContext";

export default function EditEmployee() {
  const { id } = useParams(); // Obtiene el id del empleado desde la URL
  const navigate = useNavigate();
  const { token } = useContext(AppContext);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
    job_title: "",
    joined_at: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true); // Para mostrar el estado de carga

  useEffect(() => {
    async function fetchEmployee() {
      try {
        const response = await fetch(`/api/employee/${id}`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
  
        const data = await response.json();
        console.log('Employee data:', data);
  
        if (response.ok) {
          setFormData({
            name: data.employee.user.name,
            email: data.employee.user.email,
            password: "",
            password_confirmation: "",
            job_title: data.employee.job_title,
            joined_at: data.employee.joined_at,
          });
        } else {
          console.error("Error fetching employee:", data.message || "Unknown error");
        }
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    }
  
    if (id && token) {
      fetchEmployee();
    }
  }, [id, token]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  async function handleUpdate(e) {
    e.preventDefault();

    const res = await fetch(`/api/employee/${id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const data = await res.json();

    if (data.errors) {
      setErrors(data.errors);
    } else {
      navigate("/employee"); // Redirigir a la página de empleados
    }
  }

  if (loading) {
    return <div>Loading...</div>; // Mostrar un estado de carga mientras se obtienen los datos
  }

  return (
    <div>
      <h1 className="title text-2xl text-center font-bold m-6">Editar Empleado</h1>

      <form onSubmit={handleUpdate} className="w-full max-w-lg mx-auto p-6 space-y-6 bg-white shadow-md rounded-lg">
        {/* Nombre */}
        <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nombre del empleado</label>
        <input
            type="text"
            name="name"
            id="name"
            placeholder="Nombre del empleado"
            value={formData.name || ''}  // Asegúrate de que 'name' tenga un valor, o usa una cadena vacía si está vacía
            onChange={handleInputChange}
            className="mt-2 w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-300"
        />
        {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name[0]}</p>}
        </div>

        {/* Email */}
        <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Correo electrónico</label>
        <input
            type="email"
            name="email"
            id="email"
            placeholder="Correo electrónico"
            value={formData.email || ''}  // Asegúrate de que 'email' tenga un valor, o usa una cadena vacía si está vacía
            onChange={handleInputChange}
            className="mt-2 w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-300"
        />
        {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email[0]}</p>}
        </div>

        {/* Cargo */}
        <div>
          <label htmlFor="job_title" className="block text-sm font-medium text-gray-700">Cargo</label>
          <input
            type="text"
            name="job_title"
            id="job_title"
            placeholder="Cargo del empleado"
            value={formData.job_title}
            onChange={handleInputChange}
            className="mt-2 w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-300"
          />
          {errors.job_title && <p className="text-sm text-red-500 mt-1">{errors.job_title[0]}</p>}
        </div>

        {/* Fecha de Ingreso */}
        <div>
          <label htmlFor="joined_at" className="block text-sm font-medium text-gray-700">Fecha de Ingreso</label>
          <input
            type="date"
            name="joined_at"
            id="joined_at"
            value={formData.joined_at}
            onChange={handleInputChange}
            className="mt-2 w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-300"
          />
          {errors.joined_at && <p className="text-sm text-red-500 mt-1">{errors.joined_at[0]}</p>}
        </div>

        {/* Botones */}
        <div className="flex justify-center space-x-4">
          <button
            type="submit"
            className="bg-green-500 text-white px-6 py-3 rounded-md hover:bg-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-300 transition duration-300 ease-in-out"
          >
            Actualizar Empleado
          </button>

          <button
            type="button"
            onClick={() => navigate("/employee")}
            className="bg-red-500 text-white text-base px-6 py-3 rounded-md hover:bg-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-300 transition duration-300 ease-in-out"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}