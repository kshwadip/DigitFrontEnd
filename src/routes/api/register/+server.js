
const url = import.meta.env.VITE_API_URL_1;

export async function POST({ request }) {
    const { username, phoneNumber, password } = await request.json();
    
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, phoneNumber, password })
        });
        const data = await response.json();
        if (response.ok) {    
            return new Response(JSON.stringify({ message: data.message }),{ status: data.status }); 
        } else {
            return new Response(JSON.stringify({ message: data.message }),{ status: data.status });
        }
    } catch (err) {
        return new Response(JSON.stringify({ message: err.message }),{ status: 500 });
    }
};
