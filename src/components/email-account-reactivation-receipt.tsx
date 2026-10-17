import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
  Row,
  Column,
} from '@react-email/components';
import type { CSSProperties } from 'react';

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
    preview: 'Pago confirmado y expediente reactivado - IGECO',
    title: 'Comprobante de pago de activación de expediente',
    subtitle: 'Tu pago fue confirmado y el acceso a tu expediente fue restablecido.',
    paymentDetails: 'Detalles del pago',
    customer: 'Cliente:',
    email: 'Correo:',
    company: 'Empresa:',
    paymentId: 'ID de pago:',
    date: 'Fecha:',
    summary: 'Resumen del pago',
    concept: 'Concepto',
    conceptValue: 'Reactivación por expediente incompleto',
    amount: 'Monto',
    total: 'Total pagado:',
    reactivated: '¡Expediente reactivado!',
    reactivatedDesc: 'Ya puedes ingresar nuevamente a tu expediente para completar la documentación pendiente y atender las observaciones del equipo de revisión.',
    important: 'Sobre tu documentación',
    importantDesc: 'El pago cubre la multa de reactivación. Debes completar los documentos obligatorios pendientes; la autorización del expediente y la emisión de la Carta de montaje siguen sujetas a la revisión administrativa.',
    nextSteps: '¿Qué sigue?',
    steps: [
      '1. Ingresa al dashboard de IGECO y abre "Mi expediente".',
      '2. Revisa los documentos obligatorios y los comentarios del administrador.',
      '3. Carga los documentos pendientes o corrige los que tengan observaciones.',
      '4. Selecciona "Enviar documentos" y da seguimiento al estado de tu expediente.',
    ],
    accessFile: 'Ir a mi expediente',
    keepReceipt: 'Conserva este correo como comprobante de pago. Si necesitas ayuda con esta operación, comparte el ID de pago indicado arriba.',
    support: '¿Necesitas ayuda?',
    supportDesc: 'Si tienes dudas sobre la reactivación o el acceso a tu expediente, contacta a tu asesor de ventas o al soporte técnico.',
    needInvoice: '📄 ¿Necesitas factura?',
    invoiceInstruction: 'Si deseas factura, favor de reenviar este correo a:',
    includeInEmail: 'Incluye en tu correo:',
    invoiceItems: [
      '✓ Tus datos personales',
      '✓ Adjunta tu Constancia de Situación Fiscal (CSF)',
      '✓ Adjunta este correo y tu comprobante bancario',
      '✓ Menciona el método de pago (Tarjeta de Crédito o Débito)',
      '✓ Uso de CFDI',
    ],
    automaticEmail: 'Este es un correo automático, por favor no respondas a este mensaje.',
    copyright: '© {year} IGECO. Todos los derechos reservados.',
  },
  en: {
    preview: 'Payment confirmed and document access restored - IGECO',
    title: 'Document reactivation payment receipt',
    subtitle: 'Your payment was confirmed and access to your dossier was restored.',
    paymentDetails: 'Payment details',
    customer: 'Customer:',
    email: 'Email:',
    company: 'Company:',
    paymentId: 'Payment ID:',
    date: 'Date:',
    summary: 'Payment summary',
    concept: 'Description',
    conceptValue: 'Reactivation for incomplete dossier',
    amount: 'Amount',
    total: 'Total paid:',
    reactivated: 'Document access restored!',
    reactivatedDesc: 'You can now access your file again to complete pending documents and address feedback from the review team.',
    important: 'About your documents',
    importantDesc: 'This payment covers the reactivation fine. You must still complete any pending required documents; file approval and the issuance of the mounting letter remain subject to administrative review.',
    nextSteps: 'What comes next?',
    steps: [
      '1. Log in to the IGECO dashboard and open "My file".',
      '2. Review the required documents and the administrator\'s comments.',
      '3. Upload pending documents or correct any documents with feedback.',
      '4. Select "Submit documents" and follow the status of your file.',
    ],
    accessFile: 'Go to my file',
    keepReceipt: 'Keep this email as proof of payment. If you need help with this transaction, share the payment ID shown above.',
    support: 'Need help?',
    supportDesc: 'If you have questions about reactivation or access to your file, contact your sales advisor or technical support.',
    needInvoice: '📄 Need an invoice?',
    invoiceInstruction: 'If you need an invoice, please forward this email to:',
    includeInEmail: 'Include in your email:',
    invoiceItems: [
      '✓ Your personal information',
      '✓ Attach your Tax Status Certificate (CSF)',
      '✓ Attach this email and your bank receipt',
      '✓ Mention the payment method (Credit or Debit Card)',
      '✓ CFDI Use',
    ],
    automaticEmail: 'This is an automatic email, please do not reply to this message.',
    copyright: '© {year} IGECO. All rights reserved.',
  },
  it: {
    preview: 'Pagamento confermato e accesso al fascicolo ripristinato - IGECO',
    title: 'Ricevuta pagamento multa documentale',
    subtitle: "Il tuo pagamento è stato confermato e l'accesso al dossier è stato ripristinato.",
    paymentDetails: 'Dettagli del pagamento',
    customer: 'Cliente:',
    email: 'Email:',
    company: 'Azienda:',
    paymentId: 'ID pagamento:',
    date: 'Data:',
    summary: 'Riepilogo del pagamento',
    concept: 'Descrizione',
    conceptValue: 'Riattivazione per dossier incompleto',
    amount: 'Importo',
    total: 'Totale pagato:',
    reactivated: 'Accesso al fascicolo ripristinato!',
    reactivatedDesc: 'Ora puoi accedere nuovamente al tuo fascicolo per completare la documentazione mancante e rispondere alle osservazioni del team di revisione.',
    important: 'Informazioni sui tuoi documenti',
    importantDesc: "Il pagamento copre la multa di riattivazione. Devi ancora completare i documenti obbligatori mancanti; l'approvazione del fascicolo e il rilascio della carta di montaggio restano soggetti alla revisione amministrativa.",
    nextSteps: 'Quali sono i prossimi passi?',
    steps: [
      '1. Accedi alla dashboard di IGECO e apri "Il mio fascicolo".',
      "2. Controlla i documenti obbligatori e i commenti dell'amministratore.",
      '3. Carica i documenti mancanti o correggi quelli con osservazioni.',
      '4. Seleziona "Invia documenti" e segui lo stato del tuo fascicolo.',
    ],
    accessFile: 'Vai al mio fascicolo',
    keepReceipt: "Conserva questa email come prova di pagamento. Se hai bisogno di assistenza per questa operazione, comunica l'ID pagamento indicato sopra.",
    support: 'Hai bisogno di aiuto?',
    supportDesc: 'Se hai domande sulla riattivazione o sull\'accesso al fascicolo, contatta il tuo consulente di vendita o il supporto tecnico.',
    needInvoice: '📄 Hai bisogno di una fattura?',
    invoiceInstruction: 'Se hai bisogno di una fattura, inoltra questa email a:',
    includeInEmail: 'Includi nella tua email:',
    invoiceItems: [
      '✓ I tuoi dati personali',
      '✓ Allega il tuo Certificato di Situazione Fiscale (CSF)',
      '✓ Allega questa email e la ricevuta bancaria',
      '✓ Menziona il metodo di pagamento (Carta di Credito o Debito)',
      '✓ Uso CFDI',
    ],
    automaticEmail: "Questa è un'email automatica, per favore non rispondere a questo messaggio.",
    copyright: '© {year} IGECO. Tutti i diritti riservati.',
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
  const currentYear = new Date().getFullYear();
  const numberLocale = locale === 'es' ? 'es-MX' : locale === 'en' ? 'en-US' : 'it-IT';
  const formattedAmount = `${currency} ${totalAmount.toLocaleString(numberLocale, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
  const paymentDetails = [
    { label: t.customer, value: userName },
    { label: t.email, value: userEmail },
    ...(userCompany ? [{ label: t.company, value: userCompany }] : []),
    { label: t.paymentId, value: paymentId },
    { label: t.date, value: paymentDate },
  ];

  return (
    <Html lang={locale}>
      <Head />
      <Preview>{t.preview}</Preview>
      <Body style={styles.main}>
        <Container style={styles.container}>
          <Section style={styles.logoSection}>
            <Row>
              <Column align="right">
                <Img
                  src="https://dashboard.igeco.mx/img/italian.png"
                  width="40"
                  height="41"
                  alt="IEG"
                />
              </Column>
              <Column align="left">
                <Img
                  src="https://dashboard.igeco.mx/img/deutschemesselogo.webp"
                  width="40"
                  height="40"
                  alt="Deutsche Messe"
                />
              </Column>
            </Row>
          </Section>

          <Section style={styles.header}>
            <Heading style={styles.h1}>{t.title}</Heading>
            <Text style={styles.paragraph}>{t.subtitle}</Text>
          </Section>

          <Section style={styles.section}>
            <Heading as="h2" style={styles.h2}>{t.paymentDetails}</Heading>
            <Hr style={styles.divider} />
            {paymentDetails.map(({ label, value }) => (
              <Row key={label} style={styles.detailRow}>
                <Column style={styles.detailLabelColumn}>
                  <Text style={styles.detailLabel}>{label}</Text>
                </Column>
                <Column style={styles.detailValueColumn}>
                  <Text style={styles.detailValue}>{value}</Text>
                </Column>
              </Row>
            ))}
          </Section>

          <Section style={styles.summarySection}>
            <Heading as="h2" style={styles.h2}>{t.summary}</Heading>
            <Hr style={styles.divider} />
            <Row style={styles.tableHeader}>
              <Column style={styles.conceptColumn}>
                <Text style={styles.detailLabel}>{t.concept}</Text>
              </Column>
              <Column style={styles.amountColumn}>
                <Text style={styles.detailLabel}>{t.amount}</Text>
              </Column>
            </Row>
            <Row style={styles.tableRow}>
              <Column style={styles.conceptColumn}>
                <Text style={styles.detailValue}>{t.conceptValue}</Text>
              </Column>
              <Column style={styles.amountColumn}>
                <Text style={styles.detailValue}>{formattedAmount}</Text>
              </Column>
            </Row>
            <Hr style={styles.divider} />
            <Row style={styles.tableRow}>
              <Column style={styles.conceptColumn}>
                <Text style={styles.totalLabel}>{t.total}</Text>
              </Column>
              <Column style={styles.amountColumn}>
                <Text style={styles.totalAmount}>{formattedAmount}</Text>
              </Column>
            </Row>
          </Section>

          <Section style={styles.reactivatedSection}>
            <Heading as="h2" style={styles.h2}>{t.reactivated}</Heading>
            <Text style={styles.paragraph}>{t.reactivatedDesc}</Text>
          </Section>

          <Section style={styles.section}>
            <Heading as="h3" style={styles.h3}>{t.important}</Heading>
            <Text style={styles.paragraph}>{t.importantDesc}</Text>
          </Section>

          <Section style={styles.stepsSection}>
            <Heading as="h3" style={styles.h3}>{t.nextSteps}</Heading>
            {t.steps.map((step) => (
              <Text key={step} style={styles.stepText}>{step}</Text>
            ))}
            <Button
              href={`https://dashboard.igeco.mx/${locale}/dashboard/requirements`}
              style={styles.button}
            >
              {t.accessFile}
            </Button>
          </Section>

          <Section style={styles.section}>
            <Heading as="h3" style={styles.h3}>{t.support}</Heading>
            <Text style={styles.paragraph}>{t.supportDesc}</Text>
            <Text style={styles.paragraph}>{t.keepReceipt}</Text>
          </Section>

          <Section style={styles.invoiceSection}>
            <Heading as="h3" style={styles.h3}>{t.needInvoice}</Heading>
            <Text style={styles.paragraph}>
              {t.invoiceInstruction}{' '}
              <Link href="mailto:emmanuel.heredia@igeco.mx" style={styles.invoiceLink}>
                emmanuel.heredia@igeco.mx
              </Link>
            </Text>
            <Text style={styles.paragraph}>{t.includeInEmail}</Text>
            {t.invoiceItems.map((item) => (
              <Text key={item} style={styles.listItem}>{item}</Text>
            ))}
          </Section>

          <Section style={styles.footer}>
            <Hr style={styles.divider} />
            <Text style={styles.footerText}>{t.automaticEmail}</Text>
            <Text style={styles.footerText}>
              {t.copyright.replace('{year}', currentYear.toString())}
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

const styles = {
  main: {
    backgroundColor: '#f4f4f5',
    fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
  },
  container: {
    backgroundColor: '#ffffff',
    margin: '0 auto 64px',
    padding: '40px 20px',
    borderRadius: '8px',
    maxWidth: '600px',
  },
  logoSection: {
    padding: '32px 40px',
    textAlign: 'center',
  },
  header: {
    textAlign: 'center',
    marginBottom: '40px',
  },
  h1: {
    color: '#059669',
    fontSize: '32px',
    fontWeight: '700',
    margin: '0 0 16px',
    lineHeight: '1.2',
  },
  h2: {
    color: '#18181b',
    fontSize: '24px',
    fontWeight: '600',
    margin: '0 0 16px',
  },
  h3: {
    color: '#27272a',
    fontSize: '18px',
    fontWeight: '600',
    margin: '0 0 12px',
  },
  paragraph: {
    color: '#52525b',
    fontSize: '16px',
    lineHeight: '24px',
    margin: '0 0 16px',
  },
  section: {
    marginBottom: '32px',
  },
  summarySection: {
    marginBottom: '32px',
    backgroundColor: '#fafafa',
    padding: '24px',
    borderRadius: '8px',
  },
  reactivatedSection: {
    marginBottom: '32px',
    backgroundColor: '#d1fae5',
    padding: '24px',
    borderRadius: '8px',
    border: '2px solid #059669',
    textAlign: 'center',
  },
  stepsSection: {
    marginBottom: '32px',
    backgroundColor: '#f0f9ff',
    padding: '24px',
    borderRadius: '8px',
  },
  invoiceSection: {
    marginBottom: '32px',
    backgroundColor: '#fffbeb',
    padding: '24px',
    borderRadius: '8px',
    border: '1px solid #fbbf24',
  },
  divider: {
    borderColor: '#e4e4e7',
    margin: '16px 0',
  },
  detailRow: {
    marginBottom: '12px',
  },
  detailLabelColumn: {
    width: '35%',
    verticalAlign: 'top',
    paddingRight: '12px',
  },
  detailValueColumn: {
    width: '65%',
    verticalAlign: 'top',
  },
  detailLabel: {
    color: '#71717a',
    fontSize: '14px',
    fontWeight: '600',
    margin: '0',
  },
  detailValue: {
    color: '#18181b',
    fontSize: '14px',
    margin: '0',
    wordBreak: 'break-word',
    overflowWrap: 'anywhere',
  },
  tableHeader: {
    backgroundColor: '#f4f4f5',
    padding: '12px',
  },
  tableRow: {
    padding: '12px',
  },
  conceptColumn: {
    width: '60%',
    paddingRight: '12px',
    verticalAlign: 'top',
  },
  amountColumn: {
    width: '40%',
    textAlign: 'right',
    verticalAlign: 'top',
  },
  totalLabel: {
    color: '#18181b',
    fontSize: '16px',
    fontWeight: '700',
    margin: '0',
  },
  totalAmount: {
    color: '#059669',
    fontSize: '18px',
    fontWeight: '700',
    margin: '0',
  },
  stepText: {
    color: '#075985',
    fontSize: '15px',
    lineHeight: '24px',
    margin: '0 0 8px',
  },
  button: {
    backgroundColor: '#059669',
    borderRadius: '6px',
    color: '#ffffff',
    fontSize: '16px',
    fontWeight: '600',
    marginTop: '16px',
    padding: '12px 20px',
    textAlign: 'center',
  },
  invoiceLink: {
    color: '#78350f',
    fontWeight: '600',
    textDecoration: 'underline',
    wordBreak: 'break-word',
  },
  listItem: {
    color: '#78350f',
    fontSize: '14px',
    lineHeight: '22px',
    margin: '0 0 6px',
    paddingLeft: '8px',
  },
  footer: {
    marginTop: '40px',
    textAlign: 'center',
  },
  footerText: {
    color: '#a1a1aa',
    fontSize: '12px',
    lineHeight: '18px',
    margin: '0 0 8px',
  },
} satisfies Record<string, CSSProperties>;
