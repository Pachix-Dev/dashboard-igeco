'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useToaster } from 'app/context/ToasterContext'

export function SearchExhibitor() {
  const [searchTerm, setSearchTerm] = useState('')
  const { notify } = useToaster()
  const { register, handleSubmit } = useForm()

  const handleSearch = async (data) => {
    try {
      const response = await fetch(`/api/exhibitors/search/${data.search}`, {
        method: 'GET',
      });

      if (response.ok) {
        const results = await response.json();
        console.log(results);  
        notify('Search successful', 'success');
        
      } else {
        notify('Failed to search', 'error');
      }
    } catch (err) {
      console.error('Error in search:', err);
      notify('Error during search', 'error');
    }
  }

  return (
    <div className='search-container'>
      <h2 className='text-xl font-semibold mb-4'>Search Exhibitor</h2>
      <form onSubmit={handleSubmit(handleSearch)} className='mb-4'>
        <div className='mb-4'>
          <label className='block text-[#f1f7feb5]'>Search</label>
          <input
            type='text'
            name='search'
            {...register('search', { required: 'Search term is required' })}
            className='w-full mt-2 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-blue-300 bg-[#16171c]'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className='flex justify-end'>
          <button
            type='submit'
            className='px-4 py-2 bg-[#ffffffe6] hover:bg-[#ffffff] opacity-60 hover:opacity-100 text-black rounded-lg' >
            Search
          </button>
        </div>
      </form>
    </div>
  )
}  