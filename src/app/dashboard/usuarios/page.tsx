import { fetchUsers } from 'app/lib/db'
import { AddUser } from '../../../components/users/AddUser'
import { ListUsers } from '../../../components/users/ListUsers'
import { User } from 'app/lib/definitions'

export default async function Usuarios(){
    const users: User[] = await fetchUsers();    
    return (
        <>     
            <section className="container mx-auto w-full max-w-full px-6 md:max-w-5xl grid gap-10">
                <div className="flex justify-between items-center gap-20">
                    <h1 className="text-center font-extrabold text-2xl">Usuarios</h1>                    
                    <AddUser />
                </div>
                <ListUsers users={users} />
            </section>     
        </>
    )
}