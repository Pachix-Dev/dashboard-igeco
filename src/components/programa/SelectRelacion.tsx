'use client';

import { useState, ChangeEvent, FormEvent } from 'react';

interface Escenario {
    id: number;
    name: string;
}

interface Dia {
    id: number;
    name_esp: string;
    name_eng: string;
}

interface Props {
    escenarios: Escenario[];
    dias: Dia[];
}

export function SelectRelacion({ escenarios, dias }: Props) {
    const [form, setForm] = useState({ escenario_id: '', dia_id: '' });

    const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
        setForm({ ...form, [event.target.name]: event.target.value });
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        console.log('Relación enviada:', JSON.stringify(form));

        try {
            const response = await fetch('/api/relaciones', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            });

            if (response.ok) {
                alert('Relación agregada');
                setForm({ escenario_id: '', dia_id: '' });
            } else {
                alert('Error al agregar relación');
            }
        } catch (err) {
            console.error('Error al agregar relación:', err);
            alert('Hubo un problema al intentar agregar la relación');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="p-4 border rounded-lg">
            <h2 className="text-lg font-bold">Relacionar Escenario y Día</h2>
            
            <select
                name="escenario_id"
                value={form.escenario_id}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
            >
                <option value="">Selecciona un escenario</option>
                {escenarios.map((escenario) => (
                    <option key={escenario.id} value={escenario.id}>
                        {escenario.name}
                    </option>
                ))}
            </select>

            <select
                name="dia_id"
                value={form.dia_id}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
            >
                <option value="">Selecciona un día</option>
                {dias.map((dia) => (
                    <option key={dia.id} value={dia.id}>
                        {dia.name_esp} / {dia.name_eng}
                    </option>
                ))}
            </select>
            
            <button type="submit" className="mt-2 p-2 bg-blue-500 text-white rounded">
                Relacionar
            </button>
        </form>
    );
}
