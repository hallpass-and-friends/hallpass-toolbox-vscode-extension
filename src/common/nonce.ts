export function getNonce() {
  let result = '';
	const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	for (let i = 0; i < 32; i++) {
		result += chars.charAt(Math.floor(Math.random() * chars.length));
	}
	return result;
}