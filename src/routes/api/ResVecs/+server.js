const url = import.meta.env.VITE_API_URL_6;

export async function POST({ request }) {
	try {
		const vectorData = await request.json();

		const response = await fetch(url, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(vectorData)
		});
		if (!response.ok) {
			return new Response(JSON.stringify({ message: 'Failed 2 send data' }), {
				status: response.status
			});
		}
		return new Response(JSON.stringify('Post Success'), { status: 200 });
	} catch (error) {
		return new Response(JSON.stringify({ message: 'Error sending data' }), {
			status: 500
		});
	}
}
