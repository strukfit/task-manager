import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'
import { type Plugin, defineConfig } from 'vite'

const healthCheckPlugin = (): Plugin => ({
	name: 'health-check',
	configureServer(server) {
		server.middlewares.use('/health', (_req, res) => {
			res.setHeader('Content-Type', 'application/json')
			res.end(
				JSON.stringify({
					status: 'healthy',
					timestamp: new Date().toISOString(),
					components: {
						frontend: {
							status: 'healthy',
							uptime: process.uptime(),
						},
					},
				}),
			)
		})
	},
	configurePreviewServer(server) {
		server.middlewares.use('/health', (_req, res) => {
			res.setHeader('Content-Type', 'application/json')
			res.end(
				JSON.stringify({
					status: 'healthy',
					timestamp: new Date().toISOString(),
					components: {
						frontend: {
							status: 'healthy',
							uptime: process.uptime(),
						},
					},
				}),
			)
		})
	},
})

// https://vite.dev/config/
export default defineConfig({
	base: process.env.VITE_BASE,
	plugins: [react(), tailwindcss(), healthCheckPlugin()],
	resolve: {
		alias: {
			'@': path.resolve(__dirname, './src'),
		},
	},
	server: {
		allowedHosts: ['frontend', 'frontend-dev', 'localhost', '0.0.0.0'],
		hmr: { host: '0.0.0.0' },
		host: true, // Necessary for Docker
		port: Number(process.env.VITE_PORT),
		watch: {
			usePolling: true, // Better performance for Docker
		},
		proxy: {
			'/api': {
				target: process.env.VITE_API_URL,
				changeOrigin: true,
				rewrite: (path) => path.replace(/^\/api/, ''),
			},
			'/dev/api': {
				target: process.env.VITE_API_URL,
				changeOrigin: true,
				rewrite: (path) => path.replace(/^\/dev\/api/, ''),
			},
		},
	},
	preview: {
		host: true,
		port: Number(process.env.VITE_PORT),
	},
	build: {
		sourcemap: true,
		rollupOptions: {
			output: {
				manualChunks: {
					vendor: ['react', 'react-dom'],
					// Add other vendor chunks as needed
				},
			},
		},
	},
})
