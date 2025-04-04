'use client';

import { useState, ChangeEvent, FormEvent } from 'react';

interface Ponente {
    id: number;
    name: string;
}

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
    ponentes: Ponente[];
    escenarios: Escenario[];
    dias: Dia[];
}

export function AddPrograma({ ponentes, escenarios, dias }: Props) {
    const [form, setForm] = useState({
        title_esp: '',
        title_eng: '',
        description_esp: '',
        description_eng: '',
        duration: '',
        time: '',
        escenario_id: '',
        dia_id: '',
    });

    const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setForm({ ...form, [event.target.name]: event.target.value });
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        
        try {
            const response = await fetch('/api/programa', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            });

            if (response.ok) {
                alert('Programa agregado exitosamente');
                setForm({ title_esp: '', title_eng: '', description_esp: '', description_eng: '', duration: '', time: '', escenario_id: '', dia_id: '' });
            } else {
                alert('Error al agregar el programa');
            }
        } catch (err) {
            console.error('Error al agregar el programa:', err);
            alert('Hubo un problema al intentar agregar el programa');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="p-4 border rounded-lg">
            <h2 className="text-lg font-bold">Agregar Programa</h2>
            
            <input name="title_esp" value={form.title_esp} onChange={handleChange} placeholder="Título en Español" required className="w-full p-2 border rounded" />
            <input name="title_eng" value={form.title_eng} onChange={handleChange} placeholder="Título en Inglés" required className="w-full p-2 border rounded" />
            
            <textarea name="description_esp" value={form.description_esp} onChange={handleChange} placeholder="Descripción en Español" className="w-full p-2 border rounded"></textarea>
            <textarea name="description_eng" value={form.description_eng} onChange={handleChange} placeholder="Descripción en Inglés" className="w-full p-2 border rounded"></textarea>
            
            <input name="duration" value={form.duration} onChange={handleChange} placeholder="Duración" className="w-full p-2 border rounded" />
            <input name="time" value={form.time} onChange={handleChange} placeholder="Hora" required className="w-full p-2 border rounded" />
            
            <select name="dia_id" value={form.dia_id} onChange={handleChange} required className="w-full p-2 border rounded">
                <option value="">Selecciona un día</option>
                {dias.map(dia => (
                    <option key={dia.id} value={dia.id}>{dia.name_esp} / {dia.name_eng}</option>
                ))}
            </select>
            
            <select name="escenario_id" value={form.escenario_id} onChange={handleChange} required className="w-full p-2 border rounded">
                <option value="">Selecciona un escenario</option>
                {escenarios.map(escenario => (
                    <option key={escenario.id} value={escenario.id}>{escenario.name}</option>
                ))}
            </select>
            
            <button type="submit" className="mt-2 p-2 bg-blue-500 text-white rounded">Agregar Programa</button>
        </form>
    );
}
