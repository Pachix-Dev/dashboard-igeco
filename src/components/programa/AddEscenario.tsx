'use client';

import { useState } from 'react';

export function AddEscenario() {
    const [form, setForm] = useState({ name: ''});

    const handleChange = (event: { target: { name: any; value: any; }; }) => setForm({ ...form, [event.target.name]: event.target.value });

    const handleSubmit = async (event: { preventDefault: () => void; }) => {
        event.preventDefault();
        const response = await fetch('/api/programa', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(form),
        });

        if (response.ok) {
            alert('Escenario agregado');
            setForm({ name: '' });
        } else {
            alert('Error al agregar escenario');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="p-4 border rounded-lg">
            <h2 className="text-lg font-bold">Agregar Escenario</h2>
            <input
                type="text"
                name="name"
                placeholder="Nombre"
                value={form.name}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
            />
            
            <button type="submit" className="mt-2 p-2 bg-blue-500 text-white rounded">Agregar</button>
        </form>
    );
}
