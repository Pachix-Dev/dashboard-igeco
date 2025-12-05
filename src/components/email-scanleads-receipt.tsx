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
  Img,
} from '@react-email/components'

interface ScanLeadsReceiptProps {
  userName: string
  userEmail: string
  userCompany?: string
  totalAmount: number
  currency: string
  paymentId: string
  paymentDate: string
  locale?: 'es' | 'en' | 'it'
}

// Traducciones
const translations = {
  es: {
    preview: 'Módulo Scan Leads activado - IGECO',
    thankYou: '¡Bienvenido al Módulo Scan Leads!',
    description: 'Tu pago ha sido procesado exitosamente. El módulo Scan Leads ya está activado en tu cuenta.',
    purchaseDetails: 'Detalles de la compra',
    customer: 'Cliente:',
    email: 'Correo:',
    company: 'Empresa:',
    paymentId: 'ID de pago:',
    date: 'Fecha:',
    summary: 'Resumen de compra',
    concept: 'Concepto',
    amount: 'Monto',
    module: 'Módulo Scan Leads - Acceso durante el evento',
    totalPaid: 'Total pagado:',
    activated: '¡Módulo Activado!',
    activatedDesc: 'Ya puedes comenzar a escanear leads de visitantes durante el evento.',
    features: 'Características incluidas:',
    feature1: '✓ Escaneo QR ilimitado durante el evento',
    feature2: '✓ Base de datos de contactos completa',
    feature3: '✓ Exportación a Excel de todos tus leads',
    feature4: '✓ Reportes y métricas en tiempo real',
    feature5: '✓ Notas personalizadas por cada lead',
    feature6: '✓ Acceso seguro y encriptado',
    howToStart: '¿Cómo empezar?',
    step1: '1. Ingresa al dashboard de IGECO',
    step2: '2. Accede al módulo "Escanear Leads"',
    step3: '3. Abre el scanner y comienza a capturar leads',
    step4: '4. Exporta tus contactos al finalizar el evento',
    support: '¿Necesitas ayuda?',
    supportDesc: 'Si tienes dudas o problemas con el módulo, contacta a tu asesor de ventas o al soporte técnico.',
    needInvoice: '📄 ¿Necesitas factura?',
    invoiceInstruction: 'Si deseas factura, favor de reenviar este correo a:',
    includeInEmail: 'Incluye en tu correo:',
    personalData: '✓ Tus datos personales',
    taxDocument: '✓ Constancia de Situación Fiscal',
    receipt: '✓ Este recibo de compra',
    paymentMethod: '✓ Método de pago (Tarjeta de Crédito o Débito)',
    cfdiUse: '✓ Uso de CFDI',
    automaticEmail: 'Este es un correo automático, por favor no respondas a este mensaje.',
    copyright: '© {year} IGECO. Todos los derechos reservados.',
  },
  en: {
    preview: 'Scan Leads Module Activated - IGECO',
    thankYou: 'Welcome to the Scan Leads Module!',
    description: 'Your payment has been successfully processed. The Scan Leads module is now active on your account.',
    purchaseDetails: 'Purchase Details',
    customer: 'Customer:',
    email: 'Email:',
    company: 'Company:',
    paymentId: 'Payment ID:',
    date: 'Date:',
    summary: 'Purchase Summary',
    concept: 'Description',
    amount: 'Amount',
    module: 'Scan Leads Module - Access during the event',
    totalPaid: 'Total Paid:',
    activated: 'Module Activated!',
    activatedDesc: 'You can now start scanning visitor leads during the event.',
    features: 'Included features:',
    feature1: '✓ Unlimited QR scanning during the event',
    feature2: '✓ Complete contact database',
    feature3: '✓ Export all your leads to Excel',
    feature4: '✓ Real-time reports and metrics',
    feature5: '✓ Custom notes for each lead',
    feature6: '✓ Secure and encrypted access',
    howToStart: 'How to get started?',
    step1: '1. Log in to the IGECO dashboard',
    step2: '2. Access the "Scan Leads" module',
    step3: '3. Open the scanner and start capturing leads',
    step4: '4. Export your contacts at the end of the event',
    support: 'Need help?',
    supportDesc: 'If you have questions or issues with the module, contact your sales advisor or technical support.',
    needInvoice: '📄 Need an invoice?',
    invoiceInstruction: 'If you need an invoice, please forward this email to:',
    includeInEmail: 'Include in your email:',
    personalData: '✓ Your personal information',
    taxDocument: '✓ Tax Status Certificate',
    receipt: '✓ This purchase receipt',
    paymentMethod: '✓ Payment method (Credit or Debit Card)',
    cfdiUse: '✓ CFDI Use',
    automaticEmail: 'This is an automatic email, please do not reply to this message.',
    copyright: '© {year} IGECO. All rights reserved.',
  },
  it: {
    preview: 'Modulo Scan Leads Attivato - IGECO',
    thankYou: 'Benvenuto al Modulo Scan Leads!',
    description: 'Il tuo pagamento è stato elaborato con successo. Il modulo Scan Leads è ora attivo sul tuo account.',
    purchaseDetails: 'Dettagli dell\'acquisto',
    customer: 'Cliente:',
    email: 'Email:',
    company: 'Azienda:',
    paymentId: 'ID pagamento:',
    date: 'Data:',
    summary: 'Riepilogo acquisto',
    concept: 'Descrizione',
    amount: 'Importo',
    module: 'Modulo Scan Leads - Accesso durante l\'evento',
    totalPaid: 'Totale Pagato:',
    activated: 'Modulo Attivato!',
    activatedDesc: 'Ora puoi iniziare a scansionare i lead dei visitatori durante l\'evento.',
    features: 'Funzionalità incluse:',
    feature1: '✓ Scansione QR illimitata durante l\'evento',
    feature2: '✓ Database completo dei contatti',
    feature3: '✓ Esportazione di tutti i tuoi lead in Excel',
    feature4: '✓ Report e metriche in tempo reale',
    feature5: '✓ Note personalizzate per ogni lead',
    feature6: '✓ Accesso sicuro e crittografato',
    howToStart: 'Come iniziare?',
    step1: '1. Accedi alla dashboard di IGECO',
    step2: '2. Accedi al modulo "Scan Leads"',
    step3: '3. Apri lo scanner e inizia a catturare lead',
    step4: '4. Esporta i tuoi contatti alla fine dell\'evento',
    support: 'Hai bisogno di aiuto?',
    supportDesc: 'Se hai domande o problemi con il modulo, contatta il tuo consulente di vendita o il supporto tecnico.',
    needInvoice: '📄 Hai bisogno di una fattura?',
    invoiceInstruction: 'Se hai bisogno di una fattura, inoltra questa email a:',
    includeInEmail: 'Includi nella tua email:',
    personalData: '✓ I tuoi dati personali',
    taxDocument: '✓ Certificato di Situazione Fiscale',
    receipt: '✓ Questa ricevuta di acquisto',
    paymentMethod: '✓ Metodo di pagamento (Carta di Credito o Debito)',
    cfdiUse: '✓ Uso CFDI',
    automaticEmail: 'Questa è un\'email automatica, per favore non rispondere a questo messaggio.',
    copyright: '© {year} IGECO. Tutti i diritti riservati.',
  },
}

export default function ScanLeadsReceipt({
  userName,
  userEmail,
  userCompany,
  totalAmount,
  currency,
  paymentId,
  paymentDate,
  locale = 'es',
}: ScanLeadsReceiptProps) {
  const t = translations[locale]
  const currentYear = new Date().getFullYear()

  return (
    <Html>
      <Head />
      <Preview>{t.preview}</Preview>
      <Body style={main}>
        <Container style={container}>
            {/* Logo */}
          <Section style={logoSection}>
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

          {/* Header */}
          <Section style={header}>
            <Heading style={h1}>{t.thankYou}</Heading>
            <Text style={paragraph}>{t.description}</Text>
          </Section>

          {/* Purchase Details */}
          <Section style={section}>
            <Heading as="h2" style={h2}>
              {t.purchaseDetails}
            </Heading>
            <Hr style={divider} />
            
            <Row style={detailRow}>
              <Column>
                <Text style={detailLabel}>{t.customer}</Text>
              </Column>
              <Column>
                <Text style={detailValue}>{userName}</Text>
              </Column>
            </Row>

            <Row style={detailRow}>
              <Column>
                <Text style={detailLabel}>{t.email}</Text>
              </Column>
              <Column>
                <Text style={detailValue}>{userEmail}</Text>
              </Column>
            </Row>

            {userCompany && (
              <Row style={detailRow}>
                <Column>
                  <Text style={detailLabel}>{t.company}</Text>
                </Column>
                <Column>
                  <Text style={detailValue}>{userCompany}</Text>
                </Column>
              </Row>
            )}

            <Row style={detailRow}>
              <Column>
                <Text style={detailLabel}>{t.paymentId}</Text>
              </Column>
              <Column>
                <Text style={detailValue}>{paymentId}</Text>
              </Column>
            </Row>

            <Row style={detailRow}>
              <Column>
                <Text style={detailLabel}>{t.date}</Text>
              </Column>
              <Column>
                <Text style={detailValue}>{paymentDate}</Text>
              </Column>
            </Row>
          </Section>

          {/* Purchase Summary */}
          <Section style={summarySection}>
            <Heading as="h2" style={h2}>
              {t.summary}
            </Heading>
            <Hr style={divider} />
            
            <Row style={tableHeader}>
              <Column style={tableColConcept}>
                <Text style={tableHeaderText}>{t.concept}</Text>
              </Column>
              <Column style={tableColAmount}>
                <Text style={tableHeaderText}>{t.amount}</Text>
              </Column>
            </Row>

            <Row style={tableRow}>
              <Column style={tableColConcept}>
                <Text style={tableText}>{t.module}</Text>
              </Column>
              <Column style={tableColAmount}>
                <Text style={tableTextAmount}>
                  ${totalAmount.toLocaleString('es-MX', { minimumFractionDigits: 2 })} {currency}
                </Text>
              </Column>
            </Row>

            <Hr style={divider} />

            <Row style={totalRow}>
              <Column style={tableColConcept}>
                <Text style={totalLabel}>{t.totalPaid}</Text>
              </Column>
              <Column style={tableColAmount}>
                <Text style={totalAmountcss}>
                  ${totalAmount.toLocaleString('es-MX', { minimumFractionDigits: 2 })} {currency}
                </Text>
              </Column>
            </Row>
          </Section>

          {/* Module Activated */}
          <Section style={activatedSection}>
            <Heading as="h2" style={h2Centered}>
              🎉 {t.activated}
            </Heading>
            <Text style={paragraphCentered}>{t.activatedDesc}</Text>
          </Section>

          {/* Features */}
          <Section style={featuresSection}>
            <Heading as="h3" style={h3}>
              {t.features}
            </Heading>
            <Text style={featureText}>{t.feature1}</Text>
            <Text style={featureText}>{t.feature2}</Text>
            <Text style={featureText}>{t.feature3}</Text>
            <Text style={featureText}>{t.feature4}</Text>
            <Text style={featureText}>{t.feature5}</Text>
            <Text style={featureText}>{t.feature6}</Text>
          </Section>

          {/* How to Start */}
          <Section style={stepsSection}>
            <Heading as="h3" style={h3}>
              {t.howToStart}
            </Heading>
            <Text style={stepText}>{t.step1}</Text>
            <Text style={stepText}>{t.step2}</Text>
            <Text style={stepText}>{t.step3}</Text>
            <Text style={stepText}>{t.step4}</Text>
          </Section>

          {/* Support */}
          <Section style={supportSection}>
            <Heading as="h3" style={h3}>
              {t.support}
            </Heading>
            <Text style={paragraph}>{t.supportDesc}</Text>
          </Section>

          {/* Invoice Information */}
          <Section style={invoiceSection}>
            <Heading as="h3" style={h3}>
              {t.needInvoice}
            </Heading>
            <Text style={paragraph}>
              {t.invoiceInstruction} <strong>emmanuel.heredia@igeco.mx</strong>
            </Text>
            <Text style={paragraph}>{t.includeInEmail}</Text>
            <Text style={listItem}>{t.personalData}</Text>
            <Text style={listItem}>{t.taxDocument}</Text>
            <Text style={listItem}>{t.receipt}</Text>
            <Text style={listItem}>{t.paymentMethod}</Text>
            <Text style={listItem}>{t.cfdiUse}</Text>
          </Section>

          {/* Footer */}
          <Section style={footer}>
            <Hr style={divider} />
            <Text style={footerText}>{t.automaticEmail}</Text>
            <Text style={copyright}>
              {t.copyright.replace('{year}', currentYear.toString())}
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

// Estilos
const logoSection = {
  padding: '32px 40px',
  textAlign: 'center' as const,
}

const main = {
  backgroundColor: '#f4f4f5',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
}

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '40px 20px',
  marginBottom: '64px',
  borderRadius: '8px',
  maxWidth: '600px',
}

const header = {
  textAlign: 'center' as const,
  marginBottom: '40px',
}

const h1 = {
  color: '#059669',
  fontSize: '32px',
  fontWeight: '700',
  margin: '0 0 16px',
  lineHeight: '1.2',
}

const h2 = {
  color: '#18181b',
  fontSize: '24px',
  fontWeight: '600',
  margin: '0 0 16px',
}

const h2Centered = {
  ...h2,
  textAlign: 'center' as const,
}

const h3 = {
  color: '#27272a',
  fontSize: '18px',
  fontWeight: '600',
  margin: '0 0 12px',
}

const paragraph = {
  color: '#52525b',
  fontSize: '16px',
  lineHeight: '24px',
  margin: '0 0 16px',
}

const paragraphCentered = {
  ...paragraph,
  textAlign: 'center' as const,
}

const section = {
  marginBottom: '32px',
}

const summarySection = {
  marginBottom: '32px',
  backgroundColor: '#fafafa',
  padding: '24px',
  borderRadius: '8px',
}

const activatedSection = {
  marginBottom: '32px',
  backgroundColor: '#d1fae5',
  padding: '24px',
  borderRadius: '8px',
  border: '2px solid #059669',
}

const featuresSection = {
  marginBottom: '32px',
  backgroundColor: '#f0fdfa',
  padding: '24px',
  borderRadius: '8px',
}

const stepsSection = {
  marginBottom: '32px',
  backgroundColor: '#f0f9ff',
  padding: '24px',
  borderRadius: '8px',
}

const supportSection = {
  marginBottom: '32px',
}

const invoiceSection = {
  marginBottom: '32px',
  backgroundColor: '#fffbeb',
  padding: '24px',
  borderRadius: '8px',
  border: '1px solid #fbbf24',
}

const divider = {
  borderColor: '#e4e4e7',
  margin: '16px 0',
}

const detailRow = {
  marginBottom: '12px',
}

const detailLabel = {
  color: '#71717a',
  fontSize: '14px',
  fontWeight: '600',
  margin: '0',
}

const detailValue = {
  color: '#18181b',
  fontSize: '14px',
  margin: '0',
}

const tableHeader = {
  backgroundColor: '#f4f4f5',
  borderRadius: '4px',
  padding: '12px',
  marginBottom: '8px',
}

const tableHeaderText = {
  color: '#18181b',
  fontSize: '14px',
  fontWeight: '600',
  margin: '0',
}

const tableRow = {
  padding: '12px',
  borderBottom: '1px solid #f4f4f5',
}

const tableText = {
  color: '#52525b',
  fontSize: '14px',
  margin: '0',
}

const tableTextAmount = {
  color: '#18181b',
  fontSize: '14px',
  fontWeight: '500',
  margin: '0',
  textAlign: 'right' as const,
}

const tableColConcept = {
  width: '70%',
}

const tableColAmount = {
  width: '30%',
  textAlign: 'right' as const,
}

const totalRow = {
  padding: '16px 12px',
}

const totalLabel = {
  color: '#18181b',
  fontSize: '16px',
  fontWeight: '700',
  margin: '0',
}

const totalAmountcss = {
  color: '#059669',
  fontSize: '18px',
  fontWeight: '700',
  margin: '0',
  textAlign: 'right' as const,
}

const featureText = {
  color: '#065f46',
  fontSize: '15px',
  lineHeight: '24px',
  margin: '0 0 8px',
}

const stepText = {
  color: '#075985',
  fontSize: '15px',
  lineHeight: '24px',
  margin: '0 0 8px',
  fontWeight: '500',
}

const listItem = {
  color: '#78350f',
  fontSize: '14px',
  lineHeight: '22px',
  margin: '0 0 6px',
  paddingLeft: '8px',
}

const footer = {
  marginTop: '40px',
  textAlign: 'center' as const,
}

const footerText = {
  color: '#a1a1aa',
  fontSize: '12px',
  lineHeight: '18px',
  margin: '0 0 8px',
}

const copyright = {
  color: '#a1a1aa',
  fontSize: '12px',
  margin: '0',
}
