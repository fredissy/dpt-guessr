import svelte from 'rollup-plugin-svelte';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import livereload from 'rollup-plugin-livereload';
import { terser } from '@rollup/plugin-terser';
import css from 'rollup-plugin-css-only';
import json from '@rollup/plugin-json';
import replace from '@rollup/plugin-replace';

const production = !process.env.ROLLUP_WATCH;

// config({ path: process.env.NODE_ENV == undefined ?'.env':`.env.${process.env.NODE_ENV}` })

// inspired from https://dev.to/3dayweek/how-to-load-environment-variables-in-svelte-19bp
// const configToReplace = {};
// for (const [key, v] of Object.entries(config({ path: process.env.NODE_ENV == undefined ?'.env':`.env.${process.env.NODE_ENV}` }).parsed)) {
//   configToReplace[`process.env.${key}`] = JSON.stringify(`${v}`)
// }

function serve() {
	let server;

	function toExit() {
		if (server) server.kill(0);
	}

	return {
		writeBundle() {
			if (server) return;
			server = require('child_process').spawn('npm', ['run', 'start', '--', '--dev'], {
				stdio: ['ignore', 'inherit', 'inherit'],
				shell: true
			});

			process.on('SIGTERM', toExit);
			process.on('exit', toExit);
		}
	};
}

export default {
	input: 'src/main.js',
	output: {
		sourcemap: true,
		format: 'iife',
		name: 'app',
		file: 'public/build/bundle.js'
	},
	plugins: [
		// replace environment variables for dotenv values :
		// replace({
		// 	preventAssignment: true,
		// 	values: configToReplace,
		// }),
		json(),
		svelte({
			compilerOptions: {
				// enable run-time checks when not in production
				dev: !production
			}
		}),
		// we'll extract any component CSS out into
		// a separate file - better for performance
		css({ output: 'bundle.css' }),

		// If you have external dependencies installed from
		// npm, you'll most likely need these plugins. In
		// some cases you'll need additional configuration -
		// consult the documentation for details:
		// https://github.com/rollup/plugins/tree/master/packages/commonjs
		resolve({
			browser: true,
			dedupe: ['svelte']
		}),
		commonjs(),

		// In dev mode, call `npm run start` once
		// the bundle has been generated
		!production && serve(),

		// Watch the `public` directory and refresh the
		// browser on changes when not in production
		!production && livereload('public'),

		// If we're building for production (npm run build
		// instead of npm run dev), minify
		production && terser()
	],
	watch: {
		clearScreen: false
	}
};
