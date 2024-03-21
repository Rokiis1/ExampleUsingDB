import { build } from 'esbuild';

// Replace './src/server.js' with the entry point to your application
build({
	entryPoints: ['./server.mjs'],
	bundle: true,
	platform: 'node',
	target: 'node16', // Adjust this to your Node.js version
	outfile: './dist/server.js',
	format: 'esm',  // Set the output format to "esm"
	external: ['mock-aws-s3', 'aws-sdk', 'nock', '@mapbox/node-pre-gyp']  // Add this line
}).catch(() => process.exit(1));