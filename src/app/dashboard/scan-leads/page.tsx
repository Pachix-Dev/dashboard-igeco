import { fetchRercordsByUserId } from 'app/lib/db';
import { QrScanner } from '../../../components/scannleads/QrScanner'
import { Lead } from 'app/lib/definitions'
import { useSessionUser } from 'app/store/session-user';

export default async function ScanLeads() {
    const { userSession } = useSessionUser();
    const leads: Lead[] = await fetchRercordsByUserId(userSession.id );    
    return (
        <section className="container mx-auto w-full max-w-full px-6 md:max-w-5xl">
                <div className="flex justify-between items-center gap-20">
                    <h1 className="text-center font-extrabold text-2xl">Leads</h1>
                    <QrScanner />                                     
                </div>
        </section>
    )
}