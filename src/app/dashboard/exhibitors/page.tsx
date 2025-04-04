

import { fetchEscenarios, fetchDias } from 'app/lib/db';
import { AddEscenario } from 'app/components/programa/AddEscenario';
import { Adddias } from 'app/components/programa/Adddias';

import { SelectRelacion } from 'app/components/programa/SelectRelacion';

export default async function Escenarios() {
    const escenarios = await fetchEscenarios();
    const dias = await fetchDias();

    return (
        <>      
            <section className="container mx-auto w-full max-w-full md:max-w-5xl grid gap-10">
                <div className="flex justify-between items-center gap-20">
                    <h1 className="text-center font-extrabold text-2xl">Gestión de Escenarios y Días</h1>
                </div> 
                <AddEscenario />
            <Adddias/>
                <SelectRelacion escenarios={escenarios} dias={dias} />
                
            </section>     
        </>
    );
}
