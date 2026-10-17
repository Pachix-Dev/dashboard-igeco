const PAYPAL_SANDBOX_API = 'https://api-m.sandbox.paypal.com';

const getPayPalApiBase = () => process.env.PAYPAL_API_URL || PAYPAL_SANDBOX_API;

const paypalJsonHeaders = (accessToken: string) => ({
  Authorization: `Bearer ${accessToken}`,
  'Content-Type': 'application/json'
});

export async function getPayPalAccessToken() {
  const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error('PayPal credentials not configured');
  }

  const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
  const response = await fetch(`${getPayPalApiBase()}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: 'grant_type=client_credentials'
  });

  if (!response.ok) {
    throw new Error('Failed to get PayPal access token');
  }

  const data = await response.json();
  if (!data?.access_token) {
    throw new Error('Invalid PayPal access token response');
  }

  return String(data.access_token);
}

export async function getPayPalOrder(orderId: string) {
  const accessToken = await getPayPalAccessToken();
  const response = await fetch(`${getPayPalApiBase()}/v2/checkout/orders/${orderId}`, {
    method: 'GET',
    headers: paypalJsonHeaders(accessToken)
  });

  if (!response.ok) {
    throw new Error('Failed to verify payment with PayPal');
  }

  return response.json();
}

export async function capturePayPalOrder(orderId: string) {
  const accessToken = await getPayPalAccessToken();
  const response = await fetch(`${getPayPalApiBase()}/v2/checkout/orders/${orderId}/capture`, {
    method: 'POST',
    headers: paypalJsonHeaders(accessToken)
  });

  if (!response.ok) {
    throw new Error('Failed to capture PayPal order');
  }

  return response.json();
}
