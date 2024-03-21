import * as esbuild from 'esbuild';
import dotenv from 'dotenv';

if (process.env.NODE_ENV === 'production') {
	dotenv.config({ path: '.env.production' });
} else {
	dotenv.config({ path: '.env.local' });
}

try {
	await esbuild.build({
		entryPoints: ['./server.mjs'],
		bundle: true,
		sourcemap: false,
		minify: true,
		platform: 'node',
		target: 'node16',
		packages: 'external',
		define: {
			'process.env.NODE_ENV': `'${process.env.NODE_ENV}'`
		},
		outfile: './dist/server.js'
	});

	console.log('Server bundled successfully for production!');
} catch (error) {
	console.error('An error occurred during bundling:', error);
	process.exit(1);
}