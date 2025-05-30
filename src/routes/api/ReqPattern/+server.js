const url = import.meta.env.VITE_API_URL_7;

export async function POST({ request }) {
	try {
		const numbers = await request.json();
		const response = await fetch(url, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(numbers)
		});

		if (!response.ok) {
			return new Response(JSON.stringify({ message: 'Failed to send data' }), {
				status: response.status
			});
		}
		const data = await response.json();
		return new Response(JSON.stringify({ data }), {
			status: 200
		});

	} catch (error) {
		return new Response(JSON.stringify({ message: 'Error sending data' }), {
			status: 500
		});
	}
}
