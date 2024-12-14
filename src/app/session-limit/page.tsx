'use client';

import { useSessionUser } from "app/store/session-user";
import { useRouter } from "next/navigation";

export default function SessionLimit() {
  const {userSession} = useSessionUser();
  const router = useRouter()
  const closeAllSessions = async () => {
    try {
      const response = await fetch('/api/close-sessions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id:userSession?.id}),
      });

      if (response.ok) {
        router.push('/');
      }
    } catch (error) {
      console.error('Error: no se pudo cerrar sesiones');
    }
  };

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-3xl font-extrabold">Session Limit</h1>
      <p>Has alcanzado el límite de sesiones activas.</p>
      <p>Cierra todas las sesiones para continuar o contacta a tu proveedor para contratar un paquete adicional.</p>
      <button onClick={closeAllSessions} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4">
        Cerrar todas las sesiones
      </button>
    </div>
  );
}