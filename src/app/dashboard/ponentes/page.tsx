import { Exhibitor } from 'app/lib/definitions';
import {AddExhibitor} from '../../../components/exhibitors/AddExhibitor'
import { fetchExhibitors } from 'app/lib/db';
import { unstable_noStore as noStore } from 'next/cache';
import {ListExhibitors} from '../../../components/exhibitors/ListExhibitors'

export default async function Ponentes(){
    noStore();
    const ponentes: Exhibitor[] = await fetchExhibitors();
    return (
        <>      
            <section className="container mx-auto w-full max-w-full md:max-w-5xl grid gap-10">
                <div className="flex justify-between items-center gap-20">
                    <h1 className="text-center font-extrabold text-2xl">Ponentes</h1>                    
                    <AddExhibitor />
                </div>                 
                
            </section>     
        </>
    )
}