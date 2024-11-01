export const dynamic = 'force-dynamic' // defaults to auto

export async function POST(req: { body: any; }) {
  const { username, password } = req.body;
  if (username === 'admin' && password === 'admin') {
    return {
      status: 200,
      body: { message: 'Success' },
    };
  } else {
    return {
      status: 401,
      body: { message: 'Invalid credentials' },
    };
  }
}