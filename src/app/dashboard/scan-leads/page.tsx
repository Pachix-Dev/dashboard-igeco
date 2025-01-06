import { fetchRecordsByUserId } from 'app/lib/db';
import { QrScanner } from '../../../components/scannleads/QrScanner'
import { Lead } from 'app/lib/definitions'
import { FetchLeads } from 'app/components/scannleads/FetchLeads'
import { ExportExcel } from 'app/components/scannleads/ExportExcel'
import { unstable_noStore as noStore } from 'next/cache';

export default async function ScanLeads() {
    noStore();
    const leads: Lead[] = await fetchRecordsByUserId();    
    return (
        <section className="container mx-auto w-full max-w-full px-6 md:max-w-5xl grid gap-10">
            <div className="flex justify-between items-center gap-20">
                <h1 className="text-center font-extrabold text-2xl">Leads</h1>
                <div className='grid md:flex gap-4'>
                    <ExportExcel leads={leads} />
                    <QrScanner />                                     
                </div>
            </div>
            <FetchLeads leads={leads} />
        </section>
    )
}