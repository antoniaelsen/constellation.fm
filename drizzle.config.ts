import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';
import { env } from '$env/dynamic/private';

export default defineConfig({
	out: './drizzle',
	schema: './src/lib/server/db/schema.ts',
	dialect: 'postgresql',
	dbCredentials: {
		url: env.DATABASE_URL!
	}
});
