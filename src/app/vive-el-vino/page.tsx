import { getBoletos } from "app/lib/db";
import { LineByDay }  from 'app/components/Charts/LineByDay';


 
export default async function ViveelvinoPage() {
    const boletos = await getBoletos();
    
    
    const labelsByDay = boletos.map((boletos) => boletos.created_at.toLocaleDateString('en-US', {year: 'numeric', month: '2-digit', day: '2-digit'})) as string[];
    
    const dateCounts = {} as Record<string, number>;

    labelsByDay.forEach(date => {
      dateCounts[date] = (dateCounts[date] || 0) + 1;
    });

    const counts = Object.values(dateCounts) as number[];
    const uniqueDates = Object.keys(dateCounts);
    
    return (
      <main className="min-h-screen p-4 w-full ">
          <h1>Vive el Vino</h1>
          <div className="w-full h-full overflow-x-scroll">
            <LineByDay labelsByDay={uniqueDates} values={counts} ticketsSold={boletos.length}/>
          </div>
      </main>
    );
}



