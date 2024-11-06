export default function usuarios(){
    return (
        <>      
            <section className="container mx-auto w-full max-w-full px-6 md:max-w-5xl">
                <div className="flex justify-between items-center gap-20">
                    <h1 className="text-center font-extrabold text-2xl">Usuarios</h1>                    
                    <button className="bg-[#E6E6E7] text-black rounded-md p-2 flex items-center justify-center gap-2 font-bold hover:bg-slate-400 hover:text-white">
                        + Agregar Usuario
                    </button>                   
                </div>
            </section>     
        </>
    )
}