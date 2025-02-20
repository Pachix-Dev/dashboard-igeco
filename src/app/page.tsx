'use client';

import { useState } from 'react';
import { useSessionUser } from 'app/store/session-user';
import { Img } from '@react-email/components';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);


    const [isLoading, setIsLoading] = useState(false); // Nuevo estado de carga  
    const { setUserSession } = useSessionUser();

    const handleSubmit = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();


        setIsLoading(true); // Mostrar spinner lo inicializamos solo si esta cargando

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
            
        } finally {
            setIsLoading(false); // Ocultar spinner cuando finzaliza la carga y entra 
        }
    };

    return (
        <main className='flex h-screen items-center justify-center relative'>
            {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-200 bg-opacity-50 z-10">
                    <div className="w-12 h-12 border-4 border-gray-600 border-t-transparent rounded-full animate-spin"></div>
                </div>
            )}
            <section className="mx-auto w-full max-w-[450px] px-4">
                <div className='flex justify-center gap-2'>
                    <Img src='/img/deutschemesselogo.webp' alt='logo' className='rounded-2xl w-16' />
                    <Img src='/img/italian.png' alt='logo' className='rounded-2xl w-16' />
                </div>
                <h1 className="mt-5 text-lg font-extrabold text-center">
                    Log in to IGECO
                </h1>
                <form onSubmit={handleSubmit} className='mt-5'>
                    <div className='grid'>
                        <label>Usuario</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className='mt-2 rounded-md bg-[#ddeaf814] px-2 py-1'
                            placeholder='user@example.com'
                        />
                    </div>
                    <div className='mt-2 grid'>
                        <label>Contraseña</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className='mt-2 rounded-md bg-[#ddeaf814] px-2 py-1'
                            placeholder="••••••••••••"
                            autoComplete='off'
                        />
                    </div>
                    {error && <p style={{ color: 'red' }}>{error}</p>}

                    <button 
                        type="submit" 
                        className={`bg-[#E6E6E7] text-black rounded-md p-2 mt-5 flex items-center justify-center gap-2 font-bold w-full ${
                            isLoading ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                        disabled={isLoading} // Deshabilita el botón mientras carga y esta apareiendo la ventana
                    > 
                    
                        {isLoading ? ( // Esto es lo que se muestre en la pantalla al momento de que e este cargando 
                            <div className="w-5 h-5 border-2 border-gray-600 border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                            <>
                                Continuar 
                                <svg className="-mr-1" fill="none" height="22" viewBox="0 0 24 24" width="22">
                                    <path d="M13.75 6.75L19.25 12L13.75 17.25" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"></path>
                                    <path d="M19 12H4.75" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"></path>
                                </svg>
                            </>
                        )}
                    </button>
                </form>
                <p className='mt-5'>By signing in, you agree to our Terms of Service and <a href='https://igeco.mx/aviso-de-privacidad' target='_blank' className='text-[#3b9eff]'>Privacy Policy.</a></p>  
            </section>                  
        </main>
    );
}
