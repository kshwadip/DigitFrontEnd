const url = import.meta.env.VITE_API_URL_2; 

export async function POST({ request }) {
	const { usernameOrPhone, password, deviceId } = await request.json();
	try {
		const response = await fetch(url, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ usernameOrPhone, password, deviceId })
		});

		const data = await response.json();
		if (response.ok) {
			return new Response(JSON.stringify({ success: true, redirectTo: '/hidden' }), {
				status: 200
			});
		} else {
			return new Response(JSON.stringify({ message: data.message }), { status: response.status });
		}
	} catch (err) {
		return new Response(JSON.stringify({ message: err.message }), { status: 500 });
	}
}
