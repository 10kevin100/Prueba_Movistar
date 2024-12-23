import { useContext, useState } from "react";
import { AppContext } from "../../Context/AppContext";
import { useNavigate } from "react-router-dom";

export default function EmployeeCreate() {
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

  async function handleCreate(e) {
    e.preventDefault();

    const res = await fetch("/api/employee", {
      method: "POST",
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
      navigate("/Employee");
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <>
      <h1 className="title text-2xl text-center font-bold m-6">Crear Nuevo Empleado</h1>

      <form onSubmit={handleCreate} className="w-full max-w-lg mx-auto p-6 space-y-6 bg-white shadow-md rounded-lg">
        <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nombre del empleado</label>
            <input
            type="text"
            name="name"
            id="name"
            placeholder="Nombre del empleado"
            value={formData.name}
            onChange={handleInputChange}
            maxLength={60}
            className="mt-2 w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-300"
            />
            {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name[0]}</p>}
        </div>

        <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Correo electrónico</label>
            <input
            type="email"
            name="email"
            id="email"
            placeholder="Correo electrónico"
            value={formData.email}
            onChange={handleInputChange}
            maxLength={40}
            className="mt-2 w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-300"
            />
            {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email[0]}</p>}
        </div>

        <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Contraseña</label>
            <input
            type="password"
            name="password"
            id="password"
            placeholder="Contraseña"
            value={formData.password}
            onChange={handleInputChange}
            maxLength={20}
            className="mt-2 w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-300"
            />
            {errors.password && <p className="text-sm text-red-500 mt-1">{errors.password[0]}</p>}
        </div>

        <div>
            <label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-700">Confirmar contraseña</label>
            <input
            type="password"
            name="password_confirmation"
            id="password_confirmation"
            placeholder="Confirmar contraseña"
            value={formData.password_confirmation}
            onChange={handleInputChange}
            maxLength={20}
            className="mt-2 w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-300"
            />
            {errors.password_confirmation && <p className="text-sm text-red-500 mt-1">{errors.password_confirmation[0]}</p>}
        </div>

        <div>
            <label htmlFor="job_title" className="block text-sm font-medium text-gray-700">Cargo</label>
            <input
            type="text"
            name="job_title"
            id="job_title"
            placeholder="Cargo"
            value={formData.job_title}
            onChange={handleInputChange}
            maxLength={50}
            className="mt-2 w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-300"
            />
            {errors.job_title && <p className="text-sm text-red-500 mt-1">{errors.job_title[0]}</p>}
        </div>

        <div>
            <label htmlFor="joined_at" className="block text-sm font-medium text-gray-700">Fecha de Ingreso</label>
            <input
            type="date"
            name="joined_at"
            id="joined_at"
            placeholder="Fecha de Ingreso"
            value={formData.joined_at}
            onChange={handleInputChange}
            className="mt-2 w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-300"
            />
            {errors.joined_at && <p className="text-sm text-red-500 mt-1">{errors.joined_at[0]}</p>}
        </div>

        {/* Botones de Acción */}
        <div className="flex justify-center space-x-4">
          <button
            type="submit"
            className="bg-green-500 text-white px-6 py-3 rounded-md hover:bg-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-300 transition duration-300 ease-in-out"
          >
            Crear Empleado
          </button>
          
          {/* Botón Cancelar */}
          <button
            type="button"
            onClick={() => navigate("/employee")}
            className="bg-red-500 text-white text-base px-6 py-3 rounded-md hover:bg-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-300 transition duration-300 ease-in-out"
          >
            Cancelar
          </button>
        </div>
      </form>
    </>
  );
}