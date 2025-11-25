import { EmailTemplate } from '../../../components/email-template';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  const { name, email, password, locale = 'es' } = await req.json();  

  const subjects = {
    es: '¡Bienvenido a IGECO! - Tus credenciales de acceso',
    en: 'Welcome to IGECO! - Your access credentials',
    it: 'Benvenuto in IGECO! - Le tue credenziali di accesso',
  };

  try {
    const { data, error } = await resend.emails.send({
      from: 'IGECO <noreply@igeco.mx>',
      to: email,
      subject: subjects[locale as 'es' | 'en' | 'it'] || subjects.es,
      react: EmailTemplate({ name, email, password, locale: locale as 'es' | 'en' | 'it' }),
    });

    if (error) {
      console.error('Resend error:', error);
      return Response.json({ message: 'No pudimos enviar el email. Por favor, verifica tu correo.', status: false }, { status: 500 });
    }

    return Response.json({ message: 'Email de bienvenida enviado exitosamente. Revisa tu bandeja de entrada.', status: true }, { status: 200 });
   
  } catch (error) {
    console.error(error);
    return Response.json({ message: 'No pudimos enviarte la información verifica que tu correo este bien escrito o sea valido..', status: false }, { status: 500 });
  }
}
