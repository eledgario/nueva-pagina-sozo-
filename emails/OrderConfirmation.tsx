import {
  Body,
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
} from '@react-email/components';

interface OrderConfirmationEmailProps {
  name: string;
  company: string;
  orderType: string;
  orderId: string;
}

export default function OrderConfirmationEmail({
  name = 'Cliente',
  company = 'Tu Empresa',
  orderType = 'Kit Personalizado',
  orderId = 'SOZO-XXXX',
}: OrderConfirmationEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Tu solicitud ha sido recibida - Sozo Corporate Labs</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Img
              src="https://sozo.mx/sozo-logo.png"
              width="120"
              height="40"
              alt="Sozo"
              style={logo}
            />
          </Section>

          {/* Main Content */}
          <Section style={content}>
            <Heading style={h1}>
              Hola {name}, bienvenido a la infraestructura Sozo.
            </Heading>

            <Text style={paragraph}>
              Hemos recibido tu solicitud de <strong>{orderType}</strong> para{' '}
              <strong>{company}</strong>.
            </Text>

            {/* Status Badge */}
            <Section style={statusSection}>
              <div style={statusBadge}>
                <span style={statusDot}>●</span>
                <span style={statusText}>En revision por el equipo de diseno</span>
              </div>
            </Section>

            <Text style={paragraph}>
              Nuestro equipo de Producers esta revisando tu solicitud y preparando
              una propuesta visual personalizada. Te contactaremos por WhatsApp
              en menos de <strong>2 horas</strong>.
            </Text>

            {/* Order Details Box */}
            <Section style={orderBox}>
              <Text style={orderBoxTitle}>Detalles de tu solicitud</Text>
              <Hr style={orderBoxDivider} />
              <table style={orderTable}>
                <tbody>
                  <tr>
                    <td style={orderLabel}>Referencia:</td>
                    <td style={orderValue}>{orderId}</td>
                  </tr>
                  <tr>
                    <td style={orderLabel}>Tipo:</td>
                    <td style={orderValue}>{orderType}</td>
                  </tr>
                  <tr>
                    <td style={orderLabel}>Empresa:</td>
                    <td style={orderValue}>{company}</td>
                  </tr>
                  <tr>
                    <td style={orderLabel}>Status:</td>
                    <td style={orderValue}>
                      <span style={statusPending}>Pendiente</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </Section>

            {/* What's Next */}
            <Text style={h2}>¿Que sigue?</Text>

            <Section style={timeline}>
              <div style={timelineItem}>
                <div style={timelineNumber}>1</div>
                <div style={timelineContent}>
                  <Text style={timelineTitle}>Revision del equipo</Text>
                  <Text style={timelineDesc}>
                    Nuestros designers revisan tu solicitud y preparan mockups.
                  </Text>
                </div>
              </div>

              <div style={timelineItem}>
                <div style={timelineNumber}>2</div>
                <div style={timelineContent}>
                  <Text style={timelineTitle}>Propuesta por WhatsApp</Text>
                  <Text style={timelineDesc}>
                    Te enviamos propuesta visual con precios en menos de 2hrs.
                  </Text>
                </div>
              </div>

              <div style={timelineItem}>
                <div style={timelineNumber}>3</div>
                <div style={timelineContent}>
                  <Text style={timelineTitle}>Produccion y entrega</Text>
                  <Text style={timelineDesc}>
                    Una vez aprobado, iniciamos produccion con tracking en vivo.
                  </Text>
                </div>
              </div>
            </Section>

            {/* CTA Button */}
            <Section style={ctaSection}>
              <Link href="https://wa.me/5215512345678" style={ctaButton}>
                Contactar por WhatsApp
              </Link>
            </Section>
          </Section>

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              Sozo Corporate Labs
              <br />
              Manufactura Hibrida & Logistica | CDMX
            </Text>
            <Text style={footerLinks}>
              <Link href="https://sozo.mx" style={footerLink}>
                sozo.mx
              </Link>
              {' · '}
              <Link href="https://sozo.mx/privacy" style={footerLink}>
                Privacidad
              </Link>
              {' · '}
              <Link href="https://sozo.mx/terms" style={footerLink}>
                Terminos
              </Link>
            </Text>
            <Text style={footerCopyright}>
              © 2026 Sozo Inc. Todos los derechos reservados.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

// Styles
const main = {
  backgroundColor: '#f4f4f5',
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Ubuntu, sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  maxWidth: '600px',
};

const header = {
  backgroundColor: '#18181b',
  padding: '32px 40px',
  textAlign: 'center' as const,
};

const logo = {
  margin: '0 auto',
};

const content = {
  padding: '40px',
};

const h1 = {
  color: '#18181b',
  fontSize: '24px',
  fontWeight: '700',
  lineHeight: '1.4',
  margin: '0 0 24px',
};

const h2 = {
  color: '#18181b',
  fontSize: '18px',
  fontWeight: '700',
  margin: '32px 0 16px',
};

const paragraph = {
  color: '#52525b',
  fontSize: '16px',
  lineHeight: '1.6',
  margin: '0 0 16px',
};

const statusSection = {
  margin: '24px 0',
};

const statusBadge = {
  backgroundColor: '#fef3c7',
  borderRadius: '9999px',
  display: 'inline-block',
  padding: '8px 16px',
};

const statusDot = {
  color: '#f59e0b',
  marginRight: '8px',
};

const statusText = {
  color: '#92400e',
  fontSize: '14px',
  fontWeight: '600',
};

const orderBox = {
  backgroundColor: '#fafafa',
  border: '1px solid #e4e4e7',
  borderRadius: '12px',
  padding: '24px',
  margin: '24px 0',
};

const orderBoxTitle = {
  color: '#71717a',
  fontSize: '12px',
  fontWeight: '600',
  letterSpacing: '0.05em',
  margin: '0 0 12px',
  textTransform: 'uppercase' as const,
};

const orderBoxDivider = {
  borderColor: '#e4e4e7',
  margin: '12px 0',
};

const orderTable = {
  width: '100%',
};

const orderLabel = {
  color: '#71717a',
  fontSize: '14px',
  padding: '8px 0',
  width: '100px',
};

const orderValue = {
  color: '#18181b',
  fontSize: '14px',
  fontWeight: '500',
  padding: '8px 0',
};

const statusPending = {
  backgroundColor: '#fef3c7',
  borderRadius: '4px',
  color: '#92400e',
  fontSize: '12px',
  fontWeight: '600',
  padding: '4px 8px',
};

const timeline = {
  margin: '24px 0',
};

const timelineItem = {
  display: 'flex',
  marginBottom: '16px',
};

const timelineNumber = {
  alignItems: 'center',
  backgroundColor: '#FF007F',
  borderRadius: '50%',
  color: '#ffffff',
  display: 'flex',
  flexShrink: 0,
  fontSize: '14px',
  fontWeight: '700',
  height: '28px',
  justifyContent: 'center',
  marginRight: '16px',
  width: '28px',
};

const timelineContent = {
  flex: 1,
};

const timelineTitle = {
  color: '#18181b',
  fontSize: '14px',
  fontWeight: '600',
  margin: '0 0 4px',
};

const timelineDesc = {
  color: '#71717a',
  fontSize: '14px',
  margin: '0',
};

const ctaSection = {
  margin: '32px 0',
  textAlign: 'center' as const,
};

const ctaButton = {
  backgroundColor: '#25D366',
  borderRadius: '9999px',
  color: '#ffffff',
  display: 'inline-block',
  fontSize: '16px',
  fontWeight: '700',
  padding: '16px 32px',
  textDecoration: 'none',
};

const footer = {
  backgroundColor: '#18181b',
  padding: '32px 40px',
  textAlign: 'center' as const,
};

const footerText = {
  color: '#a1a1aa',
  fontSize: '14px',
  lineHeight: '1.6',
  margin: '0 0 16px',
};

const footerLinks = {
  color: '#71717a',
  fontSize: '12px',
  margin: '0 0 16px',
};

const footerLink = {
  color: '#a1a1aa',
  textDecoration: 'underline',
};

const footerCopyright = {
  color: '#52525b',
  fontSize: '12px',
  margin: '0',
};
