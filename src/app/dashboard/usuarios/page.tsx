import { AddUser } from '../../../components/users/AddUser'
export default function usuarios(){
    const users = [
            {
                id: 1,
                name: 'John Doe',
                email: 'pachi.claros@gmail.com',
                role: 'Admin'
            },
            {
                id: 2,
                name: 'Jane Doe',
                email: 'fabian.yapura@igeco.mx',
                role: 'User'
            },
        ]
    return (
        <>      
            <section className="container mx-auto w-full max-w-full px-6 md:max-w-5xl">
                <div className="flex justify-between items-center gap-20">
                    <h1 className="text-center font-extrabold text-2xl">Usuarios</h1>                    
                    <AddUser />
                </div>
                <div className="mt-6">
                    <table className="min-w-full ">
                        <thead>
                            <tr>
                                <th className="py-2 px-4 border-b border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Nombre</th>
                                <th className="py-2 px-4 border-b border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Correo</th>
                                <th className="py-2 px-4 border-b border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Rol</th>
                                <th className="py-2 px-4 border-b border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr key={user.id}>
                                    <td className="py-2 px-4 border-b border-gray-200 text-sm">{user.name}</td>
                                    <td className="py-2 px-4 border-b border-gray-200 text-sm">{user.email}</td>
                                    <td className="py-2 px-4 border-b border-gray-200 text-sm">{user.role}</td>
                                    <td className="py-2 px-4 border-b border-gray-200 text-sm">
                                        <button className="bg-[#E6E6E7] text-black rounded-md p-2 flex items-center justify-center gap-2 font-bold hover:bg-slate-400 hover:text-white">
                                            Editar
                                        </button>
                                        <button className="bg-[#E6E6E7] text-black rounded-md p-2 flex items-center justify-center gap-2 font-bold hover:bg-slate-400 hover:text-white">
                                            Eliminar
                                        </button>
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