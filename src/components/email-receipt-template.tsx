import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Preview,
  Section,
  Text,
  Row,
  Column,
} from '@react-email/components'

interface ReceiptEmailProps {
  userName: string
  userEmail: string
  userCompany?: string
  quantity: number
  pricePerSlot: number
  totalAmount: number
  currency: string
  paymentId: string
  paymentDate: string
  previousLimit: number
  newLimit: number
  locale?: 'es' | 'en' | 'it'
}

// Traducciones
const translations = {
  es: {
    preview: 'Recibo de compra - IGECO',
    thankYou: '¡Gracias por tu compra!',
    description: 'Tu pago ha sido procesado exitosamente. A continuación encontrarás los detalles de tu compra.',
    purchaseDetails: 'Detalles de la compra',
    customer: 'Cliente:',
    email: 'Correo:',
    company: 'Empresa:',
    paymentId: 'ID de pago:',
    date: 'Fecha:',
    summary: 'Resumen de compra',
    concept: 'Concepto',
    quantity: 'Cantidad',
    unitPrice: 'Precio Unit.',
    total: 'Total',
    itemDescription: 'Gafetes de expositores',
    totalPaid: 'Total pagado:',
    limitUpdate: 'Actualización de límite',
    previousLimit: 'Límite anterior',
    newLimit: 'Nuevo límite',
    canRegister: 'Ahora puedes registrar hasta {limit} expositores',
    needInvoice: '📄 ¿Necesitas factura?',
    invoiceInstruction: 'Si deseas factura, favor de renviar este correo a:',
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
    preview: 'Purchase Receipt - IGECO',
    thankYou: 'Thank you for your purchase!',
    description: 'Your payment has been successfully processed. Below you will find the details of your purchase.',
    purchaseDetails: 'Purchase Details',
    customer: 'Customer:',
    email: 'Email:',
    company: 'Company:',
    paymentId: 'Payment ID:',
    date: 'Date:',
    summary: 'Purchase Summary',
    concept: 'Description',
    quantity: 'Quantity',
    unitPrice: 'Unit Price',
    total: 'Total',
    itemDescription: 'Additional exhibitor badges',
    totalPaid: 'Total Paid:',
    limitUpdate: 'Limit Update',
    previousLimit: 'Previous Limit',
    newLimit: 'New Limit',
    canRegister: 'You can now register up to {limit} exhibitors',
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
    preview: 'Ricevuta di acquisto - IGECO',
    thankYou: 'Grazie per il tuo acquisto!',
    description: 'Il tuo pagamento è stato elaborato con successo. Di seguito troverai i dettagli del tuo acquisto.',
    purchaseDetails: "Dettagli dell'acquisto",
    customer: 'Cliente:',
    email: 'Email:',
    company: 'Azienda:',
    paymentId: 'ID pagamento:',
    date: 'Data:',
    summary: 'Riepilogo acquisto',
    concept: 'Descrizione',
    quantity: 'Quantità',
    unitPrice: 'Prezzo Unit.',
    total: 'Totale',
    itemDescription: 'Badge espositore aggiuntivi',
    totalPaid: 'Totale pagato:',
    limitUpdate: 'Aggiornamento limite',
    previousLimit: 'Limite precedente',
    newLimit: 'Nuovo limite',
    canRegister: 'Ora puoi registrare fino a {limit} espositori',
    needInvoice: '📄 Hai bisogno di una fattura?',
    invoiceInstruction: "Se hai bisogno di una fattura, inoltra questa email a:",
    includeInEmail: 'Includi nella tua email:',
    personalData: '✓ I tuoi dati personali',
    taxDocument: '✓ Certificato di Situazione Fiscale',
    receipt: '✓ Questa ricevuta di acquisto',
    paymentMethod: '✓ Metodo di pagamento (Carta di Credito o Debito)',
    cfdiUse: '✓ Uso CFDI',
    automaticEmail: "Questa è un'email automatica, si prega di non rispondere a questo messaggio.",
    copyright: '© {year} IGECO. Tutti i diritti riservati.',
  },
}

export default function ReceiptEmail({
  userName = 'Usuario',
  userEmail = 'usuario@ejemplo.com',
  userCompany,
  quantity = 5,
  pricePerSlot = 300,
  totalAmount = 1500,
  currency = 'MXN',
  paymentId = 'PAYPAL-12345',
  paymentDate = new Date().toLocaleDateString('es-MX'),
  previousLimit = 10,
  newLimit = 15,
  locale = 'es',
}: ReceiptEmailProps) {
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
            <Text style={text}>
              {t.description}
            </Text>
          </Section>

          <Hr style={hr} />

          {/* Purchase Details */}
          <Section style={detailsSection}>
            <Heading as="h2" style={h2}>
              {t.purchaseDetails}
            </Heading>
            
            <Row style={detailRow}>
              <Column style={detailLabel}>
                <Text style={detailText}>{t.customer}</Text>
              </Column>
              <Column style={detailValue}>
                <Text style={detailTextBold}>{userName}</Text>
              </Column>
            </Row>

            <Row style={detailRow}>
              <Column style={detailLabel}>
                <Text style={detailText}>{t.email}</Text>
              </Column>
              <Column style={detailValue}>
                <Text style={detailTextBold}>{userEmail}</Text>
              </Column>
            </Row>

            {userCompany && (
              <Row style={detailRow}>
                <Column style={detailLabel}>
                  <Text style={detailText}>{t.company}</Text>
                </Column>
                <Column style={detailValue}>
                  <Text style={detailTextBold}>{userCompany}</Text>
                </Column>
              </Row>
            )}

            <Row style={detailRow}>
              <Column style={detailLabel}>
                <Text style={detailText}>{t.paymentId}</Text>
              </Column>
              <Column style={detailValue}>
                <Text style={detailTextBold}>{paymentId}</Text>
              </Column>
            </Row>

            <Row style={detailRow}>
              <Column style={detailLabel}>
                <Text style={detailText}>{t.date}</Text>
              </Column>
              <Column style={detailValue}>
                <Text style={detailTextBold}>{paymentDate}</Text>
              </Column>
            </Row>
          </Section>

          <Hr style={hr} />

          {/* Items Table */}
          <Section style={itemsSection}>
            <Heading as="h2" style={h2}>
              {t.summary}
            </Heading>

            <Row style={itemHeader}>
              <Column style={itemHeaderCell}>
                <Text style={itemHeaderText}>{t.concept}</Text>
              </Column>
              <Column style={itemHeaderCellRight}>
                <Text style={itemHeaderText}>{t.quantity}</Text>
              </Column>
              <Column style={itemHeaderCellRight}>
                <Text style={itemHeaderText}>{t.unitPrice}</Text>
              </Column>
              <Column style={itemHeaderCellRight}>
                <Text style={itemHeaderText}>{t.total}</Text>
              </Column>
            </Row>

            <Row style={itemRow}>
              <Column style={itemCell}>
                <Text style={itemText}>{t.itemDescription}</Text>
              </Column>
              <Column style={itemCellRight}>
                <Text style={itemText}>{quantity}</Text>
              </Column>
              <Column style={itemCellRight}>
                <Text style={itemText}>${pricePerSlot.toLocaleString('es-MX')} {currency}</Text>
              </Column>
              <Column style={itemCellRight}>
                <Text style={itemTextBold}>${totalAmount.toLocaleString('es-MX')} {currency}</Text>
              </Column>
            </Row>

            <Hr style={hr} />

            <Row style={totalRow}>
              <Column style={totalLabel}>
                <Text style={totalText}>{t.totalPaid}</Text>
              </Column>
              <Column style={totalValue}>
                <Text style={totalAmountstyle}>${totalAmount.toLocaleString('es-MX')} {currency}</Text>
              </Column>
            </Row>
          </Section>

          <Hr style={hr} />

          {/* Limit Update */}
          <Section style={limitSection}>
            <Heading as="h2" style={h2}>
              {t.limitUpdate}
            </Heading>
            <Row style={limitRow}>
              <Column style={limitBox}>
                <Text style={limitLabel}>{t.previousLimit}</Text>
                <Text style={limitNumber}>{previousLimit}</Text>
              </Column>
              <Column style={arrowColumn}>
                <Text style={arrow}>→</Text>
              </Column>
              <Column style={limitBox}>
                <Text style={limitLabel}>{t.newLimit}</Text>
                <Text style={limitNumberNew}>{newLimit}</Text>
              </Column>
            </Row>
            <Text style={successText}>
              ✅ {t.canRegister.replace('{limit}', newLimit.toString())}
            </Text>
          </Section>

          <Hr style={hr} />

          {/* Invoice Information */}
          <Section style={invoiceSection}>
            <Heading as="h2" style={h2}>
              {t.needInvoice}
            </Heading>
            <Text style={invoiceText}>
              {t.invoiceInstruction}{' '}
              <strong style={email}>emmanuel.heredia@igeco.mx</strong>
            </Text>
            <Text style={invoiceText}>
              {t.includeInEmail}
            </Text>
            <ul style={list}>
              <li style={listItem}>{t.personalData}</li>
              <li style={listItem}>{t.taxDocument}</li>
              <li style={listItem}>{t.receipt}</li>
              <li style={listItem}>{t.paymentMethod}</li>
              <li style={listItem}>{t.cfdiUse}</li>
            </ul>
          </Section>

          <Hr style={hr} />

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              {t.automaticEmail}
            </Text>
            <Text style={footerText}>
              {t.copyright.replace('{year}', currentYear.toString())}
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

// Styles
const main = {
  backgroundColor: '#f6f9fc',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
}

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
  maxWidth: '600px',
}

const logoSection = {
  padding: '32px 40px',
  textAlign: 'center' as const,
}

const logo = {
  margin: '0 auto',
}

const header = {
  padding: '0 40px',
}

const h1 = {
  color: '#1a1a1a',
  fontSize: '32px',
  fontWeight: 'bold',
  margin: '0 0 16px',
  textAlign: 'center' as const,
}

const h2 = {
  color: '#1a1a1a',
  fontSize: '20px',
  fontWeight: 'bold',
  margin: '0 0 16px',
}

const text = {
  color: '#525252',
  fontSize: '16px',
  lineHeight: '24px',
  textAlign: 'center' as const,
  margin: '0 0 16px',
}

const hr = {
  borderColor: '#e6ebf1',
  margin: '32px 0',
}

const detailsSection = {
  padding: '0 40px',
}

const detailRow = {
  marginBottom: '12px',
}

const detailLabel = {
  width: '40%',
}

const detailValue = {
  width: '60%',
}

const detailText = {
  color: '#6b7280',
  fontSize: '14px',
  margin: 0,
}

const detailTextBold = {
  color: '#1a1a1a',
  fontSize: '14px',
  fontWeight: 'bold',
  margin: 0,
}

const itemsSection = {
  padding: '0 40px',
}

const itemHeader = {
  backgroundColor: '#f3f4f6',
  padding: '12px 16px',
  marginBottom: '8px',
}

const itemHeaderCell = {
  padding: '0 8px',
}

const itemHeaderCellRight = {
  padding: '0 8px',
  textAlign: 'right' as const,
}

const itemHeaderText = {
  color: '#1a1a1a',
  fontSize: '12px',
  fontWeight: 'bold',
  textTransform: 'uppercase' as const,
  margin: 0,
}

const itemRow = {
  padding: '12px 16px',
}

const itemCell = {
  padding: '0 8px',
}

const itemCellRight = {
  padding: '0 8px',
  textAlign: 'right' as const,
}

const itemText = {
  color: '#525252',
  fontSize: '14px',
  margin: 0,
}

const itemTextBold = {
  color: '#1a1a1a',
  fontSize: '14px',
  fontWeight: 'bold',
  margin: 0,
}

const totalRow = {
  padding: '16px',
  backgroundColor: '#f9fafb',
}

const totalLabel = {
  width: '60%',
  textAlign: 'right' as const,
  paddingRight: '16px',
}

const totalValue = {
  width: '40%',
  textAlign: 'right' as const,
}

const totalText = {
  color: '#1a1a1a',
  fontSize: '16px',
  fontWeight: 'bold',
  margin: 0,
}

const totalAmountstyle = {
  color: '#10b981',
  fontSize: '24px',
  fontWeight: 'bold',
  margin: 0,
}

const limitSection = {
  padding: '0 40px',
}

const limitRow = {
  textAlign: 'center' as const,
  margin: '20px 0',
}

const limitBox = {
  display: 'inline-block' as const,
  padding: '16px',
  backgroundColor: '#f3f4f6',
  borderRadius: '8px',
  width: '40%',
}

const arrowColumn = {
  width: '20%',
  textAlign: 'center' as const,
  verticalAlign: 'middle' as const,
}

const arrow = {
  fontSize: '24px',
  color: '#10b981',
  margin: 0,
}

const limitLabel = {
  color: '#6b7280',
  fontSize: '12px',
  textTransform: 'uppercase' as const,
  margin: '0 0 8px',
}

const limitNumber = {
  color: '#1a1a1a',
  fontSize: '32px',
  fontWeight: 'bold',
  margin: 0,
}

const limitNumberNew = {
  color: '#10b981',
  fontSize: '32px',
  fontWeight: 'bold',
  margin: 0,
}

const successText = {
  color: '#10b981',
  fontSize: '14px',
  fontWeight: 'bold',
  textAlign: 'center' as const,
  margin: '16px 0 0',
}

const invoiceSection = {
  padding: '0 40px',
  backgroundColor: '#fef3c7',
  borderRadius: '8px',
  margin: '0 40px',
}

const invoiceText = {
  color: '#78350f',
  fontSize: '14px',
  lineHeight: '20px',
  margin: '8px 0',
}

const email = {
  color: '#92400e',
  fontWeight: 'bold',
}

const list = {
  margin: '12px 0',
  paddingLeft: '20px',
}

const listItem = {
  color: '#78350f',
  fontSize: '14px',
  lineHeight: '24px',
}

const footer = {
  padding: '0 40px',
}

const footerText = {
  color: '#9ca3af',
  fontSize: '12px',
  lineHeight: '16px',
  textAlign: 'center' as const,
  margin: '8px 0',
}
