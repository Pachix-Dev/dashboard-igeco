"use client";

import { useState, useEffect } from "react";
import { AddEscenario } from "app/components/programa/AddEscenario";
import { Adddias } from "app/components/programa/Adddias";
import { AddPrograma } from "app/components/programa/AddPrograma";
import { SelectRelacion } from "app/components/programa/SelectRelacion";

export default function Escenarios() {
    const [escenarios, setEscenarios] = useState([]);
    const [dias, setDias] = useState([]);
    const [ponentes, setPonentes] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const resEscenarios = await fetch("/api/escenarios");
                const resDias = await fetch("/api/dias");
                const resPonentes = await fetch("/api/ponentes");

                if (!resEscenarios.ok || !resDias.ok || !resPonentes.ok) {
                    throw new Error("Error al obtener los datos");
                }

                const escenariosData = await resEscenarios.json();
                const diasData = await resDias.json();
                const ponentesData = await resPonentes.json();
                
                setEscenarios(escenariosData);
                setDias(diasData);
                setPonentes(ponentesData);
            } catch (error) {
                console.error("Error cargando los datos: ", error);
            }
        };

        fetchData();
    }, []);

    return (
        <section className="mx-auto w-full grid gap-10">
            <div className="flex justify-between items-center gap-20">
                <h1 className="text-center font-extrabold text-2xl">Gestión de Escenarios y Días</h1>
            </div>
            <AddEscenario />
            <Adddias />
            <SelectRelacion escenarios={escenarios} dias={dias} />
            <AddPrograma ponentes={ponentes} escenarios={escenarios} dias={dias} />
        </section>
    );
}