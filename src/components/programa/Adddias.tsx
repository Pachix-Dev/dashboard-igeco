'use client';

import { useState, ChangeEvent, FormEvent } from 'react';

export function Adddias() {
    const [form, setForm] = useState({ name_esp: '', name_eng: '' });

    // El tipo correcto para el evento de cambio en el input
    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [event.target.name]: event.target.value });
    };

    // El tipo correcto para el evento de submit del formulario
    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        console.log('Datos enviados:', JSON.stringify(form));

        try {
            const response = await fetch('/api/dias', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            });
            const data = await response.json(); // <-- Ver la respuesta del servidor


            if (response.ok) {
                alert('Día agregado');
                setForm({ name_esp: '', name_eng: '' });
                
            } else {
                alert('Error al agregar día');
            }
        } catch (err) {
            console.error('Error al agregar día:', err);
            alert('Hubo un problema al intentar agregar el día');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="p-4 border rounded-lg">
            <h2 className="text-lg font-bold">Agregar Días</h2>
            
            <input
                type="text"
                name="name_esp"
                placeholder="Nombre en español"
                value={form.name_esp}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
            />
            
            <input
                type="text"
                name="name_eng"
                placeholder="Nombre en inglés"
                value={form.name_eng}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
            />
            
            <button type="submit" className="mt-2 p-2 bg-blue-500 text-white rounded">
                Agregar
            </button>
        </form>
    );
}
