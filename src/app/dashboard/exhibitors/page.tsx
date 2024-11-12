import { Exhibitor } from 'app/lib/definitions';
import {EditExhibitor} from '../../../components/exhibitors/EditExhibitor'
import {AddExhibitor} from '../../../components/exhibitors/AddExhibitor'

import { fetchExhibitors } from 'app/lib/db';
export default async function Exhibitors(){
    const exhibitors: Exhibitor[] = await fetchExhibitors();
    return (
        <>      
            <section className="container mx-auto w-full max-w-full px-6 md:max-w-5xl">
                <div className="flex justify-between items-center gap-20">
                    <h1 className="text-center font-extrabold text-2xl">Exhibitors</h1>                    
                    <AddExhibitor />
                </div>
                <div className="mt-6">
                    <table className="min-w-full ">
                        <thead className='bg-slate-900 rounded-md'>
                            <tr className='text-left text-xs *:font-extrabold tracking-wider text-white'>
                                <th className="py-2 px-4 ">Nombre</th>
                                <th className="py-2 px-4">Correo</th>
                                <th className="py-2 px-4">Teléfono</th>
                                <th className="py-2 px-4">Rol</th>
                                <th className="py-2 px-4">Created</th>
                                <th className="py-2 px-4"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {exhibitors.map((exhibitor) => (
                                <tr key={exhibitor.id}>
                                    <td className="py-2 px-4 border-b border-gray-200 text-sm">{exhibitor.name}</td>
                                    <td className="py-2 px-4 border-b border-gray-200 text-sm">{exhibitor.email}</td>
                                    <td className="py-2 px-4 border-b border-gray-200 text-sm">{exhibitor.phone}</td>
                                    <td className="py-2 px-4 border-b border-gray-200 text-sm">{exhibitor.position}</td>
                                    <td className="py-2 px-4 border-b border-gray-200 text-sm">{exhibitor.created_at.toLocaleDateString()}</td>
                                    <td className="py-2 px-4 border-b border-gray-200 text-sm">
                                        <EditExhibitor exhibitor={exhibitor} />
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