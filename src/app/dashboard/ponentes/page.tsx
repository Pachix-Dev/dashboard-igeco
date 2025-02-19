import type { Ponentes } from 'app/lib/definitions';

import { fetchExhibitors, fetchPonenetes } from 'app/lib/db';
import { unstable_noStore as noStore } from 'next/cache';
import {ListPonentes} from '../../../components/ponente/ListPonentes'
import {AddPonentes} from '../../../components/ponente/AddPonentes'
export default async function Ponentes(){
    noStore();
    const ponente: Ponentes[] = await fetchPonenetes();
    return (
        <>      
            <section className="container mx-auto w-full max-w-full md:max-w-5xl grid gap-10">
                <div className="flex justify-between items-center gap-20">
                    <h1 className="text-center font-extrabold text-2xl">Exhibitors</h1>                    
                    <AddPonentes></AddPonentes>
                </div>                 
                <ListPonentes ponente={ponente} />
            </section>     
        </>
    )
}