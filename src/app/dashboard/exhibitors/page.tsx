import { Exhibitor } from 'app/lib/definitions';
import {EditExhibitor} from '../../../components/exhibitors/EditExhibitor'
import {AddExhibitor} from '../../../components/exhibitors/AddExhibitor'
import {SearchExhibitor} from '../../../components/exhibitors/SearchExhibitors'
import { fetchExhibitors } from 'app/lib/db';
import { unstable_noStore as noStore } from 'next/cache';

export default async function Exhibitors(){
    noStore();
    const exhibitors: Exhibitor[] = await fetchExhibitors();
    return (
        <>      
            <section className="container mx-auto w-full max-w-full md:max-w-5xl grid gap-10">
                <div className="flex justify-between items-center gap-20">
                    <h1 className="text-center font-extrabold text-2xl">Exhibitors</h1>                    
                    <AddExhibitor />
                </div>
                <SearchExhibitor /> 
                <div className="w-full overflow-x-auto overflow-y-hidden bg-[#212136] p-5 py-10 rounded-lg">
                    <table className='m-0 w-max min-w-full border-separate border-spacing-0 border-none p-0 text-left md:w-full'>
                        <thead className='bg-slate-900 rounded-md'>
                            <tr className='text-left text-xs *:font-extrabold tracking-wider text-white'>
                                <th className="h-8 border-b border-t border-slate-6 px-3 text-xs font-semibold text-slate-11 first:rounded-l-md first:border-l last:rounded-r-md last:border-r">
                                    Name
                                </th>
                                <th className="h-8 border-b border-t border-slate-6 px-3 text-xs font-semibold text-slate-11 first:rounded-l-md first:border-l last:rounded-r-md last:border-r">
                                    Lastname
                                </th>
                                <th className="h-8 border-b border-t border-slate-6 px-3 text-xs font-semibold text-slate-11 first:rounded-l-md first:border-l last:rounded-r-md last:border-r">
                                    email
                                    </th>
                                <th className="h-8 border-b border-t border-slate-6 px-3 text-xs font-semibold text-slate-11 first:rounded-l-md first:border-l last:rounded-r-md last:border-r">
                                    position
                                </th>
                                <th className="h-8 border-b border-t border-slate-6 px-3 text-xs font-semibold text-slate-11 first:rounded-l-md first:border-l last:rounded-r-md last:border-r">
                                    nationality
                                    </th>
                                <th className="h-8 border-b border-t border-slate-6 px-3 text-xs font-semibold text-slate-11 first:rounded-l-md first:border-l last:rounded-r-md last:border-r">
                                    
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {exhibitors.map((exhibitor) => (
                                <tr key={exhibitor.id}>
                                    <td className="py-2 px-4 border-b border-gray-200 text-sm">{exhibitor.name}</td>
                                    <td className="py-2 px-4 border-b border-gray-200 text-sm">{exhibitor.lastname}</td>
                                    <td className="py-2 px-4 border-b border-gray-200 text-sm">{exhibitor.email}</td>
                                    <td className="py-2 px-4 border-b border-gray-200 text-sm">{exhibitor.position}</td>
                                    <td className="py-2 px-4 border-b border-gray-200 text-sm">{exhibitor.nationality}</td>
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