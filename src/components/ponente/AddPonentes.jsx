'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useSessionUser } from 'app/store/session-user'
import { useToaster } from 'app/context/ToasterContext'

export function AddPonentes() {
  const [formData, setFormData] = useState({
    name: '',
    position: '',
    company: '',
    bio_esp: '',
    bio_eng: '',
    photo: '',
    email: '',
    phone: '',
    linkedin: '',
  })

  const { userSession } = useSessionUser()
  const [isOpen, setIsOpen] = useState(false)
  const { notify } = useToaster()

  const handleOpen = () => setIsOpen(true)
  const handleClose = () => setIsOpen(false)

  const { register, handleSubmit, formState: { errors } } = useForm()

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleUser = async () => {
    try {
      // 🔹 Primero, insertar los datos en la base de datos y obtener el UUID
      const ponenteResponse = await fetch("/api/ponentes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...formData, photo: "" }), // Enviamos un valor vacío por ahora
      });
  
      const ponenteData = await ponenteResponse.json();
  
      if (!ponenteResponse.ok) {
        notify("Failed to add user", "error");
        return;
      }
  
      const uuid = ponenteData.uuid; // Obtener el UUID generado por la API
  
      let imagePath = "";
  
      // 🔹 Luego, si el usuario subió una imagen, la enviamos a la API de upload
      if (formData.photo instanceof File) {
        const formDataFile = new FormData();
        formDataFile.append("image", formData.photo);
        formDataFile.append("uuid", uuid); // Enviar el UUID para que el nombre de la imagen coincida
  
        const uploadResponse = await fetch("/api/upload", {
          method: "POST",
          body: formDataFile,
        });
  
        const uploadData = await uploadResponse.json();
        if (uploadResponse.ok) {
          imagePath = uploadData.path; // Ruta devuelta por la API
        } else {
          notify(uploadData.error || "Image upload failed", "error");
          return;
        }
      }
  
      // 🔹 Finalmente, actualizar la entrada del ponente con la imagen
      await fetch("/api/ponentes/update-photo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ uuid, photo: imagePath }),
      });
  
      notify("User added successfully", "success");
      handleClose();
    } catch (error) {
      notify("An error occurred", "error");
    }
  };
  

  return (
    <>
      {userSession?.role === 'admin' && (
        <>
          <button
            className="bg-[#E6E6E7] text-black rounded-md p-2 flex items-center justify-center gap-2 font-bold hover:bg-slate-400 hover:text-white"
            onClick={handleOpen}
          >
            + Agregar Ponente
          </button>

          {isOpen && (
            <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
              <div className="bg-[#05050a] p-6 rounded-lg shadow-lg w-full max-w-3xl">
                <h2 className="text-xl font-semibold mb-4 text-white">
                  Add New Ponentes
                </h2>
                <form onSubmit={handleSubmit(handleUser)} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[ 
                    { label: 'Name', name: 'name' },
                    { label: 'Position', name: 'position' },
                    { label: 'Company', name: 'company' },
                    { label: 'LinkedIn URL', name: 'linkedin' },
                    { label: 'Email', name: 'email' },
                    { label: 'Phone', name: 'phone' }
                  ].map(({ label, name }) => (
                    <div key={name} className="w-full">
                      <label className="block text-[#f1f7feb5]">{label}</label>
                      <input
                        type={name === 'email' ? 'email' : 'text'}
                        name={name}
                        {...register(name, {
                          required: `${label} is required`,
                          onChange: handleChange,
                        })}
                        defaultValue={formData[name]}
                        className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-lg bg-[#16171c] text-white"
                      />
                      {errors[name] && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors[name].message}
                        </p>
                      )}
                    </div>
                  ))}

                  <div className="w-full col-span-1 md:col-span-2">
                    <label className="block text-[#f1f7feb5]">Upload Image</label>
                    <input
                      type="file"
                      accept="image/png, image/jpeg, image/jpg, image/webp"
                      onChange={(e) => setFormData({ ...formData, photo: e.target.files[0] })}
                      className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-lg bg-[#16171c] text-white"
                    />
                  </div>

                  {[ 
                    { label: 'Bio (Spanish)', name: 'bio_esp' },
                    { label: 'Bio (English)', name: 'bio_eng' }
                  ].map(({ label, name }) => (
                    <div key={name} className="w-full col-span-1 md:col-span-2">
                      <label className="block text-[#f1f7feb5]">{label}</label>
                      <textarea
                        name={name}
                        {...register(name, {
                          required: `${label} is required`,
                          onChange: handleChange,
                        })}
                        defaultValue={formData[name]}
                        rows={4}
                        className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-lg bg-[#16171c] text-white"
                      ></textarea>
                    </div>
                  ))}

                  {formData.photo && typeof formData.photo === "string" && (
                    <div className="col-span-1 md:col-span-2 flex justify-center">
                      <img src={formData.photo} alt="Uploaded preview" className="w-32 h-32 object-cover rounded-lg mt-2" />
                    </div>
                  )}

                  <div className="col-span-1 md:col-span-2 flex justify-end gap-2 mt-4">
                    <button
                      type="button"
                      onClick={handleClose}
                      className="px-4 py-2 hover:bg-[#d9edfe25] text-white rounded-lg"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-[#ffffffe6] hover:bg-[#ffffff] opacity-60 hover:opacity-100 text-black rounded-lg"
                    >
                      Add
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </>
      )}
    </>
  )
}
