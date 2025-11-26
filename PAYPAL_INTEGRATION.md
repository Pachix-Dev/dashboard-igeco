# Módulo de Compra de Expositores con PayPal

## 📋 Descripción

Este módulo permite a los usuarios comprar espacios adicionales para registrar más expositores cuando hayan alcanzado su límite máximo. La integración utiliza **PayPal** como pasarela de pago.

## 🚀 Características

- ✅ Botón de compra visible solo cuando se alcanza el límite
- ✅ Modal con selector de cantidad (1-50 espacios)
- ✅ Integración completa con PayPal
- ✅ Cálculo automático del precio total (300 MXN por espacio)
- ✅ Validación segura de pagos con PayPal Secret
- ✅ Manejo de pagos PENDING con webhooks
- ✅ Actualización automática del límite tras pago exitoso
- ✅ Registro de transacciones en base de datos
- ✅ Traducciones en 3 idiomas (ES, EN, IT)
- ✅ Notificaciones de éxito/error/pendiente

## 📦 Instalación

### 1. Instalar dependencias

```bash
npm install @paypal/react-paypal-js
```

### 2. Configurar variables de entorno

Agrega las credenciales de PayPal en tu archivo `.env.local`:

```env
# PayPal Client ID (público)
NEXT_PUBLIC_PAYPAL_CLIENT_ID=tu_paypal_client_id_aqui

# PayPal Secret (privado - NO compartir)
PAYPAL_SECRET=tu_paypal_secret_aqui

# PayPal API URL
PAYPAL_API_URL=https://api-m.sandbox.paypal.com

# PayPal Webhook ID (para verificar webhooks)
PAYPAL_WEBHOOK_ID=tu_webhook_id_aqui
```

#### Obtener credenciales de PayPal:

**Para pruebas (Sandbox):**

1. Ve a https://developer.paypal.com/dashboard
2. Inicia sesión con tu cuenta PayPal
3. Ve a "Apps & Credentials"
4. En la pestaña "Sandbox", crea una nueva app o usa una existente
5. Copia el **Client ID** y el **Secret**
6. Para webhooks:
   - Ve a "Webhooks" en el menú lateral
   - Crea un webhook apuntando a: `https://tu-dominio.com/api/webhooks/paypal`
   - Selecciona estos eventos:
     - `PAYMENT.CAPTURE.COMPLETED`
     - `PAYMENT.CAPTURE.DENIED`
     - `PAYMENT.CAPTURE.DECLINED`
     - `PAYMENT.CAPTURE.REFUNDED`
   - Copia el **Webhook ID**

**Para producción (Live):**

1. En la misma página, cambia a la pestaña "Live"
2. Crea una app y obtén las credenciales de Live
3. Cambia `PAYPAL_API_URL` a `https://api-m.paypal.com`
4. Configura los webhooks en modo Live
5. ⚠️ **IMPORTANTE:** Solo usa Live cuando estés listo para producción

### 3. Crear tabla de pagos (Opcional)

Si deseas llevar un historial de las transacciones, ejecuta este script SQL:

```bash
mysql -u tu_usuario -p tu_base_de_datos < sql/create_exhibitor_payments_table.sql
```

O ejecuta manualmente el contenido del archivo en tu base de datos.

## 🎯 Uso

El módulo se activa automáticamente cuando:

- El usuario tiene `maxexhibitors > 0`
- El usuario ha alcanzado su límite (`currentTotal >= maxExhibitors`)

### Flujo de compra:

1. El usuario ve el botón **"Comprar más espacios"** cuando alcanza su límite
2. Hace clic y se abre un modal con:
   - Información del uso actual
   - Selector de cantidad de espacios (1-50)
   - Precio calculado automáticamente con formato de miles
   - Botones de PayPal para pagar
3. El usuario completa el pago con PayPal
4. El sistema verifica el pago directamente con la API de PayPal:
   - **Si está COMPLETED:** Aplica el límite inmediatamente y muestra éxito
   - **Si está PENDING:** Registra el pago y notifica que está pendiente
5. Para pagos PENDING:
   - PayPal envía un webhook cuando el pago se complete
   - El sistema aplica el límite automáticamente
   - Se puede configurar notificación por email (opcional)
6. Se muestra una notificación según el estado
7. La página se recarga solo si el pago fue completado inmediatamente

## 💰 Precios

- **Precio por espacio:** $300 MXN
- **Cantidad mínima:** 1 espacio
- **Cantidad máxima:** 50 espacios por compra
- **Moneda:** MXN (Pesos mexicanos)
- **Formato:** Con separadores de miles ($1,500.00, $7,200.00, etc.)

Para cambiar el precio, edita la constante en `BuyExhibitors.tsx`:

```tsx
const pricePerExhibitor = 300 // Cambia este valor
```

## 🔧 Componentes Creados

### 1. `BuyExhibitors.tsx`

Componente principal que:

- Muestra el botón de compra cuando se alcanza el límite
- Maneja el modal con formulario
- Integra PayPal con locale dinámico (es_MX, en_US, it_IT)
- Procesa pagos y maneja estados COMPLETED y PENDING

### 2. API Route: `/api/exhibitors/increase-limit/route.ts`

Endpoint que:

- Verifica el pago con PayPal API usando el Secret
- Valida que el monto pagado sea correcto
- Maneja pagos COMPLETED (aplica límite inmediatamente)
- Maneja pagos PENDING (registra y espera webhook)
- Registra la transacción en la base de datos
- Retorna el estado y nuevo límite

### 3. API Route: `/api/webhooks/paypal/route.ts` ⭐ NUEVO

Endpoint webhook que:

- Recibe notificaciones de PayPal cuando cambia el estado de un pago
- Verifica la firma del webhook para seguridad
- Maneja eventos:
  - `PAYMENT.CAPTURE.COMPLETED` - Aplica el límite
  - `PAYMENT.CAPTURE.DENIED/DECLINED` - Marca como fallido
  - `PAYMENT.CAPTURE.REFUNDED` - Revierte el límite
- Actualiza automáticamente la base de datos

### 4. Tabla SQL: `exhibitor_payments`

Almacena (estructura actualizada):

- ID de usuario y pago
- Cantidad de espacios y monto pagado
- Moneda (MXN)
- Límite anterior y nuevo
- Estado del pago (PENDING, COMPLETED, FAILED, REFUNDED)
- Flag `applied` (si ya se aplicó el límite)
- Timestamps de creación, actualización y completado

## 🔄 Estados de Pago

### COMPLETED ✅

- Pago procesado exitosamente de inmediato
- El límite se aplica automáticamente
- Usuario recibe notificación de éxito
- Página se recarga mostrando nuevos espacios

### PENDING ⏳

- Pago en proceso de verificación por PayPal
- Común con eChecks o pagos internacionales
- Se registra en BD pero NO se aplica el límite aún
- Usuario recibe notificación de espera
- Cuando PayPal confirme, el webhook aplicará el límite automáticamente

### FAILED / DENIED ❌

- Pago rechazado por PayPal
- No se aplica ningún límite
- Se registra en BD como FAILED
- Usuario recibe notificación de error

### REFUNDED 💸

- Pago fue reembolsado
- El webhook revierte el límite al estado anterior
- Se marca como REFUNDED en BD

## 🎣 Webhooks de PayPal

Los webhooks permiten que PayPal notifique a tu servidor cuando cambia el estado de un pago.

### Configuración:

1. Ve a https://developer.paypal.com/dashboard
2. Selecciona tu app
3. Ve a "Webhooks"
4. Agrega webhook: `https://tu-dominio.com/api/webhooks/paypal`
5. Selecciona eventos a escuchar
6. Copia el Webhook ID

### Eventos manejados:

- `PAYMENT.CAPTURE.COMPLETED` - Pago completado
- `PAYMENT.CAPTURE.DENIED` - Pago denegado
- `PAYMENT.CAPTURE.DECLINED` - Pago rechazado
- `PAYMENT.CAPTURE.REFUNDED` - Pago reembolsado

### Testing webhooks localmente:

Para probar webhooks en desarrollo local:

```bash
# Instalar ngrok
npm install -g ngrok

# Exponer tu servidor local
ngrok http 3000

# Usar la URL de ngrok en la configuración del webhook
# Ejemplo: https://abc123.ngrok.io/api/webhooks/paypal
```

## 📝 Traducciones

Las traducciones están en `/src/messages/{es,en,it}.json` bajo la clave:

```json
{
  "ExhibitorsPage": {
    "buy": {
      "button": "...",
      "title": "...",
      "pending": "...",
      "pendingMessage": "...",
      ...
    }
  }
}
```

## 🧪 Modo de Prueba

Para probar sin realizar pagos reales:

1. Usa el **Client ID de Sandbox**
2. Crea cuentas de prueba en PayPal Developer
3. Usa las credenciales de prueba para "pagar"
4. Los pagos no serán reales pero el flujo será idéntico

### Cuentas de prueba:

- Ve a https://developer.paypal.com/dashboard/accounts
- Crea cuentas de comprador (buyer) para probar pagos
- Usa esas credenciales en el flujo de pago

## 🔒 Seguridad

- ✅ Verificación del pago directamente con PayPal API usando Secret
- ✅ Validación del monto pagado vs monto esperado
- ✅ Verificación de firma de webhooks con certificado PayPal
- ✅ Protección contra replay attacks (payment_id único)
- ✅ Validación en backend del estado del pago
- ✅ Límites de cantidad (1-50)
- ✅ Validación de usuario existente
- ✅ Transacciones atómicas en base de datos
- ✅ Secreto de PayPal nunca expuesto al cliente

## 🐛 Solución de Problemas

### "PayPal Buttons not loading"

- Verifica que `NEXT_PUBLIC_PAYPAL_CLIENT_ID` esté configurado
- Asegúrate de que el Client ID sea correcto
- Verifica la consola del navegador para errores
- Comprueba que el dominio esté en la whitelist de PayPal (producción)

### "Payment approved but limit not updated"

- Si el pago está PENDING, es normal que no se aplique inmediatamente
- Verifica que el webhook esté configurado correctamente
- Revisa los logs del servidor para errores
- Comprueba que la tabla `exhibitor_payments` exista
- Verifica que el usuario exista en la BD

### "Webhook signature verification failed"

- Asegúrate de que `PAYPAL_WEBHOOK_ID` esté configurado correctamente
- Verifica que la URL del webhook en PayPal coincida con tu endpoint
- Revisa que el certificado de PayPal sea accesible
- En desarrollo local, usa ngrok o similar para exponer el webhook

### "Invalid currency" error

- Asegúrate de que tu cuenta PayPal soporte MXN
- Verifica que la configuración de moneda sea correcta en PayPal
- Si necesitas otra moneda, actualiza en `BuyExhibitors.tsx` y `increase-limit/route.ts`

### "Pago PENDING no se completa"

- Los pagos PENDING pueden tardar días (especialmente eChecks)
- Verifica en PayPal Dashboard el estado real del pago
- Asegúrate de que los webhooks estén funcionando
- Puedes consultar la tabla `exhibitor_payments` para ver el estado

## 📧 Soporte

Para más información o soporte:

- Documentación PayPal: https://developer.paypal.com/docs
- API de PayPal React: https://www.npmjs.com/package/@paypal/react-paypal-js

---

**Desarrollado para IGECO Dashboard** 🚀
