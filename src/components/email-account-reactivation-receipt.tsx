import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
  Row,
  Column,
} from '@react-email/components';

interface AccountReactivationReceiptProps {
  userName: string;
  userEmail: string;
  userCompany?: string;
  totalAmount: number;
  currency: string;
  paymentId: string;
  paymentDate: string;
  locale?: 'es' | 'en' | 'it';
}

const copy = {
  es: {
    preview: 'Comprobante de pago - Reactivación documental',
    title: 'Comprobante de pago de multa documental',
    subtitle: 'Tu pago fue confirmado y el acceso a tu expediente fue restablecido.',
    customer: 'Cliente:',
    email: 'Correo:',
    company: 'Empresa:',
    paymentId: 'ID de pago:',
    date: 'Fecha:',
    concept: 'Concepto:',
    conceptValue: 'Reactivación por expediente incompleto',
    total: 'Total pagado:',
  },
  en: {
    preview: 'Payment receipt - Document reactivation',
    title: 'Document reactivation payment receipt',
    subtitle: 'Your payment was confirmed and access to your dossier was restored.',
    customer: 'Customer:',
    email: 'Email:',
    company: 'Company:',
    paymentId: 'Payment ID:',
    date: 'Date:',
    concept: 'Concept:',
    conceptValue: 'Reactivation for incomplete dossier',
    total: 'Total paid:',
  },
  it: {
    preview: 'Ricevuta di pagamento - Riattivazione documentale',
    title: 'Ricevuta pagamento multa documentale',
    subtitle: "Il tuo pagamento è stato confermato e l'accesso al dossier è stato ripristinato.",
    customer: 'Cliente:',
    email: 'Email:',
    company: 'Azienda:',
    paymentId: 'ID pagamento:',
    date: 'Data:',
    concept: 'Concetto:',
    conceptValue: 'Riattivazione per dossier incompleto',
    total: 'Totale pagato:',
  },
};

export default function AccountReactivationReceipt({
  userName,
  userEmail,
  userCompany,
  totalAmount,
  currency,
  paymentId,
  paymentDate,
  locale = 'es',
}: AccountReactivationReceiptProps) {
  const t = copy[locale];

  return (
    <Html>
      <Head />
      <Preview>{t.preview}</Preview>
      <Body style={{ backgroundColor: '#f8fafc', fontFamily: 'Arial, sans-serif' }}>
        <Container style={{ maxWidth: '620px', margin: '0 auto', backgroundColor: '#ffffff', padding: '24px' }}>
          <Heading style={{ fontSize: '22px', color: '#0f172a', marginBottom: '8px' }}>{t.title}</Heading>
          <Text style={{ color: '#334155', marginTop: 0 }}>{t.subtitle}</Text>
          <Hr style={{ borderColor: '#e2e8f0', margin: '20px 0' }} />

          <Section>
            <Row>
              <Column><Text>{t.customer}</Text></Column>
              <Column><Text><strong>{userName}</strong></Text></Column>
            </Row>
            <Row>
              <Column><Text>{t.email}</Text></Column>
              <Column><Text><strong>{userEmail}</strong></Text></Column>
            </Row>
            {userCompany ? (
              <Row>
                <Column><Text>{t.company}</Text></Column>
                <Column><Text><strong>{userCompany}</strong></Text></Column>
              </Row>
            ) : null}
            <Row>
              <Column><Text>{t.paymentId}</Text></Column>
              <Column><Text><strong>{paymentId}</strong></Text></Column>
            </Row>
            <Row>
              <Column><Text>{t.date}</Text></Column>
              <Column><Text><strong>{paymentDate}</strong></Text></Column>
            </Row>
            <Row>
              <Column><Text>{t.concept}</Text></Column>
              <Column><Text><strong>{t.conceptValue}</strong></Text></Column>
            </Row>
            <Row>
              <Column><Text>{t.total}</Text></Column>
              <Column><Text><strong>{currency} {totalAmount.toFixed(2)}</strong></Text></Column>
            </Row>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}
