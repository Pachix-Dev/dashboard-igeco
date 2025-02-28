'use client';

import { useSessionUser } from "app/store/session-user";
import Link from "next/link";

export default function Dashboard(){
    const { userSession } = useSessionUser();
    return (
        <section className="container mx-auto px-4 my-10">            
            <h1 className="text-center font-extrabold text-4xl">Welcome {userSession?.name}!</h1>
            {/*<div className="mt-20 flex items-center gap-2">Registra a tus expositores en la sección 
                <Link href={'/dashboard/exhibitors'} className="text-blue-600 font-bold flex items-center gap-2"> 
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" />
                    </svg>
                    Exhibitors
                </Link>            
            </div>
             <p className="mt-5">* Recuerda que la información proporcionada se usara para imprimir el gafete de acceso.</p>*/}
           
           <p className="mt-20 text-2xl font-bold">Puntos importantes:</p>
           <span className="text-gray-400 text-xl">Important points:</span>
            <ul className="mt-10 ps-5 list-disc ml-5 space-y-3">                
                <li>                    
                    Los gafetes a expositores se entregaran el día del evento en el modulo de registro de forma individual para expositores recuerda que debes presentar una identificación oficial.
                    <br />
                    <span className="text-gray-400">Exhibitor badges will be delivered on the day of the event at the registration module individually for exhibitors, remember that you must present an official ID.</span>
                </li>
                <li>                    
                    No se permiten reimpresiones de gafetes por lo que es importante conserves y guardes tu gafete durante los dias del evento de lo contrario tendra un costo adicional.
                    <br />
                    <span className="text-gray-400">Reprints of badges are not allowed, so it is important to keep and save your badge during the days of the event, otherwise it will have an additional cost.</span>
                </li>
                <li>                    
                    Si requieres registrar a mas expositores de los permitidos por favor contacta a tu asesor de ventas.
                    <br />
                    <span className="text-gray-400">If you need to register more exhibitors than allowed, please contact your sales advisor.</span>
                </li>
                <li>                    
                    Si requieres activar el servicio de escaner para recopilar datos de los visitante a tu stand contacta a tu asesor de ventas. (recuerda que este servicio solo lo puedes usar dentro de tu stand de lo contrario se cumplira con las politicas del contrato establecido).
                    <br />
                    <span className="text-gray-400">If you need to activate the scanner service to collect data from visitors to your stand, contact your sales advisor. (remember that this service can only be used within your stand, otherwise the policies of the established contract will be enforced).</span>
                </li>
            </ul>
            
        </section> 
    )
}