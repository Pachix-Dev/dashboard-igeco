import { fetchUsers } from 'app/lib/db'
import { AddUser } from '../../../components/users/AddUser'
import { EditUser } from '../../../components/users/EditUser'
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
                <div className='w-full overflow-x-auto overflow-y-hidden'>
                    <table className='m-0 w-max min-w-full border-separate border-spacing-0 border-none p-0 text-left md:w-full'>
                        <thead className='bg-slate-900 rounded-md'>
                            <tr className='text-left text-xs *:font-extrabold tracking-wider text-white'>
                                <th className="py-2 px-4 ">Nombre</th>
                                <th className="py-2 px-4">Correo</th>
                                <th className="py-2 px-4">Rol</th>
                                <th className="py-2 px-4">Created</th>
                                <th className="py-2 px-4"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr key={user.id}>
                                    <td className="py-2 px-4 border-b border-gray-200 text-sm">{user.name}</td>
                                    <td className="py-2 px-4 border-b border-gray-200 text-sm">{user.email}</td>
                                    <td className="py-2 px-4 border-b border-gray-200 text-sm">{user.role}</td>
                                    <td className="py-2 px-4 border-b border-gray-200 text-sm">{user.created_at.toLocaleDateString()}</td>
                                    <td className="py-2 px-4 border-b border-gray-200 text-sm">
                                        <EditUser user={user} />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>     
        </>
    )
}