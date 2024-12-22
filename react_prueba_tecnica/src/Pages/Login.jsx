import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../Context/AppContext'; // Importa el contexto

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { setToken, setUser } = useContext(AppContext); // Usa el contexto

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'email') setEmail(value);
    if (name === 'password') setPassword(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = { email, password };
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        localStorage.setItem('auth_token', result.token);
        setToken(result.token);
        setUser(result.user);
        navigate('/');
      } else {
        setError('Email o contraseña incorrectos');
      }
    } catch (err) {
      setError('Error al conectarse con el servidor');
      console.error('Error:', err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="bg-gray-200 p-8 rounded-lg shadow-lg max-w-md w-full">
        <div className="text-center">
          <img
            src="/images/movistar.png"
            alt="Usuario"
            className="mx-auto w-20 h-20"
          />
          <p className="text-3xl font-bold text-gray-900 mt-2">Sistema para el registro de clientes</p>
          <h2 className="text-2xl font-bold text-gray-800 m-2">Iniciar sesión</h2>
        </div>
        {error && <p className="text-red-500 text-xl text-center mb-4">{error}</p>}
        <form onSubmit={handleSubmit} noValidate>
          <div className="mb-4">
            <label htmlFor="email" className="block text-xl text-gray-700">Email:</label>
            <input
              type="email"
              name="email"
              id="email"
              value={email}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block text-xl text-gray-700">Contraseña:</label>
            <input
              type="password"
              name="password"
              id="password"
              value={password}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-6 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            Iniciar sesión
          </button>
        </form>
      </div>
    </div>
  );
}