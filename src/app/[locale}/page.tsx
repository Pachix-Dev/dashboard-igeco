'use client';

import { useState } from 'react';
import { useSessionUser } from 'app/store/session-user';
import { Img } from '@react-email/components';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const { setUserSession } = useSessionUser();

    const handleSubmit = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const res = await fetch('/api/auth', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (data.status) {
                setUserSession(data.user);
                window.location.href = '/dashboard';
            } else {
                setError(data.message);
            }
        } catch (error) {
            setError('Error al conectar con el servidor');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className='flex h-screen items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 relative'>
            {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50 backdrop-blur-sm">
                    <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
            )}
            
            <section className="mx-auto w-full max-w-md px-4">
                {/* Logos */}
                <div className='flex justify-center gap-4 mb-8'>
                    <div className='bg-white rounded-2xl p-2 shadow-lg'>
                        <Img src='/img/deutschemesselogo.webp' alt='Deutsche Messe Logo' className='rounded-xl w-20 h-20 object-contain' />
                    </div>
                    <div className='bg-white rounded-2xl p-2 shadow-lg'>
                        <Img src='/img/italian.png' alt='Italian Logo' className='rounded-xl w-20 h-20 object-contain' />
                    </div>
                </div>

                {/* Contenedor del formulario */}
                <div className='bg-white bg-opacity-10 backdrop-blur-md border border-white border-opacity-20 rounded-2xl p-8 shadow-2xl'>
                    {/* Título */}
                    <h1 className="text-3xl font-bold text-center text-white mb-2">
                        Bienvenido a IGECO
                    </h1>
                    <p className="text-center text-gray-300 text-sm mb-8">
                        Inicia sesión para acceder a tu cuenta
                    </p>

                    {/* Formulario */}
                    <form onSubmit={handleSubmit} className='space-y-5'>
                        {/* Campo Email */}
                        <div className='group'>
                            <label className='block text-sm font-semibold text-gray-200 mb-2'>
                                Correo Electrónico
                            </label>
                            <div className='relative'>
                                <svg className='absolute left-3 top-3 w-5 h-5 text-gray-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' />
                                </svg>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className='w-full pl-10 pr-4 py-3 bg-white bg-opacity-10 border border-white border-opacity-30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:bg-opacity-20 transition-all'
                                    placeholder='usuario@ejemplo.com'
                                />
                            </div>
                        </div>

                        {/* Campo Contraseña */}
                        <div className='group'>
                            <label className='block text-sm font-semibold text-gray-200 mb-2'>
                                Contraseña
                            </label>
                            <div className='relative'>
                                <svg className='absolute left-3 top-3 w-5 h-5 text-gray-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z' />
                                </svg>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className='w-full pl-10 pr-4 py-3 bg-white bg-opacity-10 border border-white border-opacity-30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:bg-opacity-20 transition-all'
                                    placeholder='••••••••••••'
                                    autoComplete='off'
                                />
                            </div>
                        </div>

                        {/* Mensaje de error */}
                        {error && (
                            <div className='bg-red-500 bg-opacity-20 border border-red-500 border-opacity-50 rounded-lg p-3'>
                                <p className='text-red-300 text-sm font-medium'>{error}</p>
                            </div>
                        )}

                        {/* Botón de envío */}
                        <button 
                            type="submit" 
                            disabled={isLoading}
                            className='w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-all duration-200 shadow-lg hover:shadow-xl'
                        > 
                            {isLoading ? ( 
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                                <>
                                    <span>Continuar</span>
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
                                    </svg>
                                </>
                            )}
                        </button>
                    </form>

                    {/* Términos y privacidad */}
                    <p className='mt-6 text-center text-gray-300 text-xs leading-relaxed'>
                        Al iniciar sesión, aceptas la 
                        <a href='https://igeco.mx/aviso-de-privacidad' target='_blank' rel='noopener noreferrer' className='text-blue-400 hover:text-blue-300 ml-1 font-semibold'>Política de Privacidad</a>
                    </p>
                </div>

                {/* Footer */}
                <p className='text-center text-gray-400 text-xs mt-6'>
                    © 2026 IGECO. Todos los derechos reservados.
                </p>
            </section>
        </main>
    );
}