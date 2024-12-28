import { EmailTemplate } from '../../../components/email-template';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  const { name, email, password } = await req.json();  

  try {
    await resend.emails.send({
      from: 'RE+ MEXICO 2025 <noreply@re-plus-mexico.com.mx>',
      to: email,
      subject: 'Te damos la bienvenida a RE+ MEXICO 2025',
      react: EmailTemplate({ name, email, password }),
    });

    return Response.json({ message: 'Gracias por registrarte, te hemos enviado las credenciales a tu correo electronico', status: true }, { status: 201 });
   
  } catch (error) {
    console.error(error);
    return Response.json({ message: 'No pudimos enviarte la información verifica que tu correo este bien escrito o sea valido..', status: false }, { status: 500 });
  }
}
