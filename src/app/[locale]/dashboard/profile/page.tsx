'use client';

import { useSessionUser } from "app/store/session-user";

export default function Profile(){
    const { userSession } = useSessionUser();
    return (
        <>
            <section>
                <h1 className="font-extrabold text-4xl">Profile</h1>
                <div className="mt-10 border border-gray-200 p-4 rounded-md">
                    <p className="font-bold">Your Name</p>
                    <p className="flex align-middle gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                        </svg>
                        {userSession?.name}
                    </p>                    
                </div>
                <div className="mt-10 border border-gray-200 p-4 rounded-md">
                    <p className="font-bold">Your Email </p>
                    <p className="flex align-middle gap-1"> 
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0Zm0 0c0 1.657 1.007 3 2.25 3S21 13.657 21 12a9 9 0 1 0-2.636 6.364M16.5 12V8.25" />
                        </svg>
                        {userSession?.email}
                    </p>                    
                </div>                
            </section>
        </>
    )
}