import { useContext, useState, useEffect } from "react";
import { AppContext } from "../../Context/AppContext";
import { useNavigate, useParams } from "react-router-dom";

export default function EditClient() {
  const navigate = useNavigate();
  const { token } = useContext(AppContext);
  const { id } = useParams();
  const [formData, setFormData] = useState({
    name: "",
    lastName: "",
    email: "",
    phone: "",
    addresses: [{ address: "", postal_code: "", country: "El Salvador" }],
    documents: [{ document_type: "", document_number: "" }],
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchClientData = async () => {
      const res = await fetch(`/api/client/${id}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();

      if (data.errors) {
        setErrors(data.errors);
      } else {
        setFormData({
          name: data.client.name,
          lastName: data.client.lastName,
          email: data.client.email,
          phone: data.client.phone,
          addresses: data.client.addresses || [{ address: "", postal_code: "", country: "El Salvador" }],
          documents: data.client.documents || [{ document_type: "", document_number: "" }],
        });
      }
    };

    if (id) {
      fetchClientData();
    }
  }, [id, token]);

  const handleInputChange = (e, index, type) => {
    const { name, value } = e.target;
    if (type === "general") {
      setFormData({ ...formData, [name]: value });
      return;
    }

    if (!Array.isArray(formData[type])) {
      console.error(`Expected formData[${type}] to be an array.`);
      return;
    }

    const updatedData = [...formData[type]];

    if (updatedData[index]) {
      updatedData[index] = { ...updatedData[index], [name]: value };
    }

    setFormData({ ...formData, [type]: updatedData });
  };

  const addField = (type) => {
    if (!Array.isArray(formData[type])) {
      console.error(`Expected formData[${type}] to be an array.`);
      return;
    }

    if (type === "addresses") {
      if (formData.addresses.length < 4) {
        setFormData({
          ...formData,
          addresses: [
            ...formData.addresses,
            { address: "", postal_code: "", country: "El Salvador" },
          ],
        });
      } else {
        alert("Solo puedes agregar hasta 4 direcciones.");
      }
    } else if (type === "documents") {
      if (formData.documents.length < 4) {
        setFormData({
          ...formData,
          documents: [
            ...formData.documents,
            { document_type: "", document_number: "" },
          ],
        });
      } else {
        alert("Solo puedes agregar hasta 4 documentos.");
      }
    }
  };

  async function handleSave(e) {
    e.preventDefault();

    const res = await fetch(`/api/client/${id}`, {
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
      navigate(`/client/`);
    }
  }

  return (
    <>
      <h1 className="title text-2xl text-center font-bold m-6">Editar Cliente</h1>

      <form onSubmit={handleSave} className="w-full max-w-lg mx-auto p-6 space-y-6 bg-white shadow-md rounded-lg">
        {/* Nombre */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nombre del cliente</label>
          <input
            type="text"
            name="name"
            id="name"
            placeholder="Nombre del cliente"
            value={formData.name}
            onChange={(e) => handleInputChange(e, null, "general")}
            className="mt-2 w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-300"
          />
          {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name[0]}</p>}
        </div>

        {/* Apellido */}
        <div>
          <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">Apellido del cliente</label>
          <input
            type="text"
            name="lastName"
            id="lastName"
            placeholder="Apellido del cliente"
            value={formData.lastName}
            onChange={(e) => handleInputChange(e, null, "general")}
            className="mt-2 w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-300"
          />
          {errors.lastName && <p className="text-sm text-red-500 mt-1">{errors.lastName[0]}</p>}
        </div>

        {/* Correo electrónico */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">Correo electrónico</label>
          <input
            type="email"
            name="email"
            id="email"
            placeholder="Correo electrónico"
            value={formData.email}
            onChange={(e) => handleInputChange(e, null, "general")}
            className="mt-2 w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-300"
          />
          {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email[0]}</p>}
        </div>

        {/* Teléfono */}
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Teléfono</label>
          <input
            type="text"
            name="phone"
            id="phone"
            placeholder="Teléfono"
            value={formData.phone}
            onChange={(e) => handleInputChange(e, null, "general")}
            className="mt-2 w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-300"
          />
          {errors.phone && <p className="text-sm text-red-500 mt-1">{errors.phone[0]}</p>}
        </div>

        {/* Direcciones */}
        <div>
          <label htmlFor="addresses" className="block text-sm font-medium text-gray-700">Direcciones</label>
          {formData.addresses?.map((address, index) => (
            <div key={index} className="space-y-2 mb-3">
              <input
                type="text"
                name="address"
                placeholder="Calle"
                value={address.address}
                onChange={(e) => handleInputChange(e, index, "addresses")}
                className="mt-2 w-full p-3 border border-gray-300 rounded-md"
              />
              <input
                type="text"
                name="postal_code"
                placeholder="Código Postal"
                value={address.postal_code}
                onChange={(e) => handleInputChange(e, index, "addresses")}
                className="mt-2 w-full p-3 border border-gray-300 rounded-md"
              />
              <input
                type="text"
                name="country"
                placeholder="País"
                value={address.country}
                onChange={(e) => handleInputChange(e, index, "addresses")}
                className="mt-2 w-full p-3 border border-gray-300 rounded-md"
                readOnly
              />
            </div>
          ))}
          <button
            type="button"
            onClick={() => addField("addresses")}
            className="bg-teal-500 text-white px-4 py-2 rounded-md"
          >
            Agregar Dirección
          </button>
        </div>

        {/* Documentos */}
        <div>
          <label htmlFor="documents" className="block text-sm font-medium text-gray-700">Documentos</label>
          {formData.documents?.map((document, index) => (
            <div key={index} className="space-y-2 mb-3">
              <input
                type="text"
                name="document_type"
                placeholder="Tipo de documento"
                value={document.document_type}
                onChange={(e) => handleInputChange(e, index, "documents")}
                className="mt-2 w-full p-3 border border-gray-300 rounded-md"
              />
              <input
                type="text"
                name="document_number"
                placeholder="Número de documento"
                value={document.document_number}
                onChange={(e) => handleInputChange(e, index, "documents")}
                className="mt-2 w-full p-3 border border-gray-300 rounded-md"
              />
            </div>
          ))}
          <button
            type="button"
            onClick={() => addField("documents")}
            className="bg-teal-500 text-white px-4 py-2 rounded-md"
          >
            Agregar Documento
          </button>
        </div>

        <div className="text-center">
          <button
            type="submit"
            className="bg-teal-500 text-white px-6 py-3 rounded-md mt-6"
          >
            Guardar Cambios
          </button>
        </div>
      </form>
    </>
  );
}