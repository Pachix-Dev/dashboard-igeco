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


export function EmailTemplate ({
  name,
  email,
  password,
}: EmailTemplateProps){
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
        <Body className="bg-offwhite text-base font-sans">          
          <Container className="bg-white p-45">
            <Row >                
              <Column >
                <Img
                  src="https://hfmexico.mx/iegx.png"
                  width="120"
                  height="66"
                  alt="IGECO" 
                  className="my-5 mx-auto"             
                />
              </Column>
              <Column >
                <Img
                  src="https://hfmexico.mx/deutsche-messe.png"
                  width="184"
                  height="40"
                  alt="IGECO"
                  className="my-5 mx-auto"
                />
              </Column>
            </Row>
            <Heading className="text-center my-0 leading-8">
              Welcome to IGECO
            </Heading>

            <Section>
              <Row>
                <Text className="text-base">
                  ¡Felicitaciones! {name}! Tu cuenta ha sido creada ahora formas parte de la comunidad de IGECO.
                </Text>

                <Text className="text-base">Aquí te explicamos cómo empezar:</Text>
              </Row>
            </Section>

            <ul>
              <li className="mb-20" key={1}>
                <strong>Nombre de usuario.</strong>{" "}
                {email}
              </li>
              <li className="mb-20" key={1}>
                <strong>Password.</strong>{" "}
                {password}
              </li>
            </ul>

            <Section className="text-center">
              <Button href="https://exhibitors.igeco.mx" className="bg-brand text-white rounded-lg py-3 px-[18px]">
                Go to your dashboard
              </Button>
            </Section>

            <Section className="mt-45">
              <Row>                
                  <Column >
                    <Link href="https://igeco.mx/" className="text-black underline font-bold">
                      Enterate de nuestros eventos
                    </Link>{" "}
                    <span className="text-green-500">→</span>
                  </Column>
                  <Column >
                    <Link href="https://igeco.mx/aviso-de-privacidad" className="text-black underline font-bold">
                      Lee nuestro aviso de privacidad
                    </Link>{" "}
                    <span className="text-green-500">→</span>
                  </Column>
                  <Column >
                    <Link className="text-black underline font-bold">
                      Contact an expert
                    </Link>{" "}
                    <span className="text-green-500">→</span>
                  </Column>
              </Row>
            </Section>
          </Container>

          <Container className="mt-20">
            <Section>
              <Row>
                <Column className="text-right px-20">
                  <Link>Unsubscribe</Link>
                </Column>
                <Column className="text-left">
                  <Link>Manage Preferences</Link>
                </Column>
              </Row>
            </Section>
            <Text className="text-center text-gray-400 mb-45">
              IGECO, Blvrd Francisco Villa 102-piso 14, Oriental, 37510 León, Guanajuato México.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

