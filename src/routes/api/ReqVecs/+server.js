const url = import.meta.env.VITE_API_URL_5;

export async function GET() {
	try {
		const response = await fetch(url);

		if (!response.ok) {
			return new Response(JSON.stringify({ message: 'Failed to fetch vectors' }), {
				status: response.status
			});
		}
		const vectors100 = await response.json();
		return new Response(JSON.stringify(vectors100), { status: 200 });
	} catch (error) {
		return new Response(JSON.stringify({ message: 'Error fetching vectors' }), { status: 500 });
	}
}
