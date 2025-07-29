import crypto from 'crypto';
import { ENCRYPTION_KEY } from '$env/static/private';

const ENCRYPTION_KEY_BUFFER = Buffer.from(ENCRYPTION_KEY, 'hex');
const ALGORITHM = 'aes-256-gcm';

export const encrypt = (text: string) => {
	const iv = crypto.randomBytes(16);

	const cipher = crypto.createCipheriv(ALGORITHM, ENCRYPTION_KEY_BUFFER, iv);
	cipher.setAAD(Buffer.from('spotify-tokens'));

	let encrypted = cipher.update(text, 'utf8', 'hex');
	encrypted += cipher.final('hex');

	const authTag = cipher.getAuthTag();

	return iv.toString('hex') + ':' + authTag.toString('hex') + ':' + encrypted;
};

export const decrypt = (encryptedData: string) => {
	const parts = encryptedData.split(':');
	const iv = Buffer.from(parts[0], 'hex');
	const authTag = Buffer.from(parts[1], 'hex');
	const encrypted = parts[2];

	const decipher = crypto.createDecipheriv(ALGORITHM, ENCRYPTION_KEY_BUFFER, iv);
	decipher.setAAD(Buffer.from('spotify-tokens'));
	decipher.setAuthTag(authTag);

	let decrypted = decipher.update(encrypted, 'hex', 'utf8');
	decrypted += decipher.final('utf8');

	return decrypted;
};
