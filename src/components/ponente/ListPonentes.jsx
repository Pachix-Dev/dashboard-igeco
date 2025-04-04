'use client';

import { useState } from 'react';
import { useSessionUser } from 'app/store/session-user';
import { QrPrinterPonente } from './QrPrinterPonentes';
import { EditPonentes } from './EditPonentes';

export function ListPonentes({ ponente }) {
  const { userSession } = useSessionUser();
  const role = userSession?.role;

  const [searchTerm, setSearchTerm] = useState('');
  const [filteredPonentes, setFilteredPonentes] = useState(ponente);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  const searchResults = (query) => {
    setSearchTerm(query);

    if (query.trim() === '') {
      setFilteredPonentes(ponente);
      setCurrentPage(1);
      return;
    }

    const lowerQuery = query.toLowerCase();
    const results = ponente.filter(
      (item) =>
        item.speaker_name.toLowerCase().includes(lowerQuery) ||
        item.position.toLowerCase().includes(lowerQuery) ||
        item.email.toLowerCase().includes(lowerQuery)
    );

    setFilteredPonentes(results);
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(filteredPonentes.length / itemsPerPage);
  const currentPonentes = filteredPonentes.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className='p-10 bg-[#212136] rounded-lg shadow-md w-full max-w-6xl mx-auto'>
      <h2 className='text-2xl font-semibold mb-6 text-white'>Contacts</h2>
      <input
        type='text'
        placeholder='Search for...'
        value={searchTerm}
        onChange={(e) => searchResults(e.target.value)}
        className='w-full p-3 border rounded-md mb-6 text-black'
      />
      <div className='space-y-6'>
        {currentPonentes.map((ponente) => (
          <div
            key={ponente.uuid}
            className='flex items-center justify-between bg-slate-900 p-6 rounded-lg shadow-md text-white'
          >
            <div className='flex items-center space-x-6'>
              <img
                src={`/ponentes/${ponente.uuid}.jpg`}
                className='w-16 h-16 rounded-full object-cover'
                alt={ponente.speaker_name}
              />
              <div>
                <p className='font-semibold text-lg'>{ponente.speaker_name}</p>
                <p className='text-sm text-gray-400'>{ponente.position}</p>
              </div>
            </div>
            <div>
              <span className='px-4 py-2 bg-blue-600 text-white rounded-full text-sm'>{ponente.company}</span>
            </div>
            <div className='text-right'>
              <p className='text-gray-400 text-sm'>Correo</p>
              <p className='font-bold text-lg'>{ponente.email}</p>
              <p className='text-gray-400 text-sm mt-2'>Impresiones: <span className='font-semibold'>{ponente.impresiones}</span></p>
            </div>
            <div className='flex items-center space-x-4'>
              <QrPrinterPonente ponente={ponente} />
              <EditPonentes ponente={ponente} />
            </div>
          </div>
        ))}
      </div>
      {totalPages > 1 && (
        <div className='flex justify-between items-center mt-6'>
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className='px-6 py-3 bg-gray-800 text-white rounded disabled:opacity-50'
          >
            Previous
          </button>
          <span className='text-sm text-gray-400'>
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className='px-6 py-3 bg-gray-800 text-white rounded disabled:opacity-50'
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}