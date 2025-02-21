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

            <Heading className="text-center text-xl font-bold my-4">Welcome to IGECO</Heading>

            <Section>
              <Text className="text-base">¡Felicitaciones, {name}! Tu cuenta ha sido creada, ahora formas parte de la comunidad de IGECO.</Text>
              <Text className="text-base mt-2">Aquí te explicamos cómo empezar:</Text>
            </Section>

            <ul className="text-left mx-auto w-fit my-5">
              <li className="mb-2"><strong>Nombre de usuario:</strong> {email}</li>
              <li className="mb-2"><strong>Password:</strong> {password}</li>
            </ul>

            <Section className="mt-6">
              <Row className="justify-center">
                <Column>
                  <Link href="https://igeco.mx/" className="text-black underline font-bold">
                    Enterate de nuestros eventos
                  </Link>
                  <span className="text-green-500"> →</span>
                </Column>
                <Column>
                  <Link href="https://igeco.mx/aviso-de-privacidad" className="text-black underline font-bold">
                    Lee nuestro aviso de privacidad
                  </Link>
                  <span className="text-green-500"> →</span>
                </Column>
                
              </Row>
            </Section>

            <Container className="mt-6">
              <Section>
                <Row className="justify-between text-sm">
                  <Column className="text-right">
                    <Link href="#" className="text-gray-500">Unsubscribe</Link>
                  </Column>
                  <Column className="text-left">
                    <Link href="#" className="text-gray-500">Manage Preferences</Link>
                  </Column>
                </Row>
              </Section>
              <Text className="text-center text-gray-400 text-xs mt-4">
                IGECO, Blvrd Francisco Villa 102-piso 14, Oriental, 37510 León, Guanajuato, México.
              </Text>
            </Container>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
