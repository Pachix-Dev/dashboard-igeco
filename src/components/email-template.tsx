import {
  Body,
  Button,
  Column,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Text,
  Tailwind,
} from "@react-email/components";
import * as React from "react";

interface EmailTemplateProps {
  name: string;
  email: string;
  password: string;
}

export function EmailTemplate({ name, email, password }: EmailTemplateProps) {
  return (
    <Html>
      <Head />
      <Preview>Igeco Welcome</Preview>
      <Tailwind
        config={{
          theme: {
            extend: {
              colors: {
                brand: "#2250f4",
                offwhite: "#fafbfb",
              },
              spacing: {
                0: "0px",
                20: "20px",
                45: "45px",
              },
            },
          },
        }}
      >
        <Body className="bg-offwhite text-base font-sans flex justify-center">
          <Container className="bg-white p-10 rounded-lg shadow-lg text-center max-w-lg mx-auto">
            <Row className="justify-center">
              <Column>
                <Img
                  src="https://hfmexico.mx/iegx.png"
                  width="120"
                  height="66"
                  alt="IGECO"
                  className="my-5 mx-auto"
                />
              </Column>
              <Column>
                <Img
                  src="https://hfmexico.mx/deutsche-messe.png"
                  width="184"
                  height="40"
                  alt="IGECO"
                  className="my-5 mx-auto"
                />
              </Column>
            </Row>

            <Heading className="text-center text-xl font-bold my-4">¡Bienvenido a IGECO!</Heading>

            <Section>
              <Text className="text-base" style={{ fontSize: '16px', lineHeight: '1.6', color: '#333333', marginBottom: '10px' }}>
                ¡Hola <strong>{name}</strong>! 🎉
              </Text>
              <Text className="text-base" style={{ fontSize: '16px', lineHeight: '1.6', color: '#333333', marginBottom: '10px' }}>
                Tu cuenta ha sido creada exitosamente. Ahora eres parte de la comunidad de IGECO y tienes acceso a nuestra plataforma de expositores.
              </Text>
              <Text className="text-base" style={{ fontSize: '16px', lineHeight: '1.6', color: '#333333', marginBottom: '20px' }}>
                A continuación encontrarás tus credenciales de acceso:
              </Text>
            </Section>

            <Section style={{ backgroundColor: '#f8f9fa', padding: '20px', borderRadius: '8px', margin: '20px 0' }}>
              <Text style={{ fontSize: '14px', color: '#666', marginBottom: '10px', textAlign: 'left' }}>
                <strong style={{ color: '#2250f4' }}>Usuario:</strong><br />
                <span style={{ fontSize: '16px', color: '#333' }}>{email}</span>
              </Text>
              <Text style={{ fontSize: '14px', color: '#666', marginBottom: '0', textAlign: 'left' }}>
                <strong style={{ color: '#2250f4' }}>Contraseña:</strong><br />
                <span style={{ fontSize: '16px', color: '#333', fontFamily: 'monospace' }}>{password}</span>
              </Text>
            </Section>
            
            <Section className="mt-6" style={{ textAlign: 'center', margin: '30px 0' }}>
              <Button
                href="https://dashboard.igeco.mx/"
                className="bg-brand text-white font-bold py-3 px-6 rounded-md"
                style={{
                  backgroundColor: '#2250f4',
                  color: '#ffffff',
                  padding: '14px 32px',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  fontWeight: 'bold',
                  display: 'inline-block',
                  fontSize: '16px',
                  boxShadow: '0 4px 6px rgba(34, 80, 244, 0.3)'
                }}
              >
                🚀 Acceder al Dashboard
              </Button>
            </Section>

            <Section style={{ borderTop: '1px solid #e5e7eb', paddingTop: '20px', marginTop: '30px' }}>
              <Text style={{ fontSize: '14px', color: '#666', textAlign: 'center', marginBottom: '15px' }}>
                ¿Necesitas ayuda? Estamos aquí para ti:
              </Text>
            </Section>

            <Section className="mt-6" style={{ marginTop: '20px' }}>
              <Row className="justify-center">
                <Column align="center" style={{ padding: '10px' }}>
                  <Link 
                    href="https://igeco.mx/" 
                    style={{ 
                      color: '#2250f4', 
                      textDecoration: 'none', 
                      fontWeight: '600',
                      fontSize: '14px'
                    }}
                  >
                    🌐 Visita nuestro sitio web
                  </Link>
                </Column>
                <Column align="center" style={{ padding: '10px' }}>
                  <Link 
                    href="https://igeco.mx/aviso-de-privacidad" 
                    style={{ 
                      color: '#2250f4', 
                      textDecoration: 'none', 
                      fontWeight: '600',
                      fontSize: '14px'
                    }}
                  >
                    🔒 Aviso de privacidad
                  </Link>
                </Column>
              </Row>
            </Section>

            <Container className="mt-6" style={{ marginTop: '30px', paddingTop: '20px', borderTop: '1px solid #e5e7eb' }}>
              <Text className="text-center text-gray-400 text-xs mt-4" style={{ fontSize: '12px', color: '#9ca3af', marginBottom: '5px' }}>
                IGECO - Italian German Exhibition Company México
              </Text>
              <Text className="text-center text-gray-400 text-xs" style={{ fontSize: '11px', color: '#9ca3af' }}>
                Blvrd Francisco Villa 102-piso 14, Oriental, 37510 León, Guanajuato, México
              </Text>
            </Container>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
