import {useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AppContext } from "../Context/AppContext";

export default function Layout() {
    const { token, setUser, setToken } = useContext(AppContext);
    const { role } = useContext(AppContext);

    const navigate = useNavigate();
  
    async function handleLogout(e) {
      e.preventDefault();
  
      const res = await fetch("/api/logout", {
        method: "post",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      const data = await res.json();
      console.log(data);
  
      if (res.ok) {
        setUser(null);
        setToken(null);
        localStorage.removeItem("token");
        navigate("/");
      }
    }
  
    return (
      <>
        <header>
          <nav className="bg-cyan-400 p-4">
            <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
              <div className="relative flex items-center justify-between h-16">
                <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                  <button className="inline-flex items-center justify-center p-2 rounded-md text-white hover:text-gray-700 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white" aria-controls="mobile-menu" aria-expanded="false">
                    <span className="sr-only">Open main menu</span>
                    <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
                    </svg>
                  </button>
                </div>
                <div className="flex items-center justify-center sm:justify-start w-full">
                <img
                    src="/images/movistar2.png"
                    alt="Usuario"
                    className="w-40 h-25 sm:w-50 sm:h-24"
                />
                </div>
                <div className="hidden sm:block sm:ml-6">
                  <div className="flex space-x-6">
                    <a href="#" className="text-white hover:bg-blue-700 px-2 py-2 rounded-md text-lg font-medium">Clientes</a>
                    {role === 'admin' && (
                    <>
                        <a href="#" className="text-white hover:bg-blue-700 px-2 py-2 rounded-md text-lg font-medium">Empleados</a>
                        <a href="#" className="text-white hover:bg-blue-700 px-2 py-2 rounded-md text-lg font-medium">Reporte</a>
                    </>
                    )}
                    <form onSubmit={handleLogout}>
                        <button className="text-white hover:bg-blue-700 px-2 py-2 rounded-md text-lg font-medium">Salir</button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </nav>
  
          {/* Mobile menu, toggle classes based on menu state */}
          <div className="sm:hidden" id="mobile-menu">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <a href="#" className="text-white block px-3 py-2 rounded-md text-base font-medium">Inicio</a>
              <a href="#" className="text-white block px-3 py-2 rounded-md text-base font-medium">Servicios</a>
              <a href="#" className="text-white block px-3 py-2 rounded-md text-base font-medium">Acerca de</a>
              <a href="#" className="text-white block px-3 py-2 rounded-md text-base font-medium">Contacto</a>
            </div>
          </div>
        </header>
      </>
    );
  }