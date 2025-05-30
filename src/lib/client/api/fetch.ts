export const apiFetch = async (url: string, init?: RequestInit) => {
	const res = await fetch(url, init);
	if (!res.ok) {
		const parsed = await res.json();
		throw new Error(parsed?.message || 'Failed to fetch');
	}
	return res;
};
