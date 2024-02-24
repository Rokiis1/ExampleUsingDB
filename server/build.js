import { build } from 'esbuild';

// Replace './src/server.js' with the entry point to your application
build({
	entryPoints: ['./server.mjs'],
	bundle: true,
	platform: 'node',
	target: 'node16', // Adjust this to your Node.js version
	outfile: './dist/server.js',
}).catch(() => process.exit(1));