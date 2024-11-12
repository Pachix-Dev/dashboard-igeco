'use client';

import { useSessionUser } from "app/store/session-user";

export default function Dashboard(){
    const { userSession } = useSessionUser();
    return (
        <>            
            <h1 className="text-center">Welcome {userSession?.name}</h1>
        </>
    )
}