import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import path from 'path';
import tailwindcss from '@tailwindcss/vite';
import svgr from 'vite-plugin-svgr';
const svgrConfig = require('./.svgrrc.cjs');

export default defineConfig(({ mode }) => {
	const isDev = mode === 'development';

	return {
		resolve: {
			alias: {
				'@': path.resolve(__dirname, './src')
			}
		},
		css: {
			modules: {
				localsConvention: 'camelCase'
			},
			preprocessorOptions: {
				scss: {
					additionalData: `
          @use "@/assets/styles/abstracts/variables" as *;
          @use "@/assets/styles/abstracts/functions" as *;
          @use "@/assets/styles/abstracts/mixins" as *;
        `
				}
			}
		},
		server: {
			port: 3000
		},
		plugins: [
			react({
				babel: {
					plugins: ['babel-plugin-react-compiler']
				}
			}),
			svgr({
				svgrOptions: svgrConfig
			}),
			tailwindcss(),
			VitePWA({
				registerType: 'autoUpdate',
				includeAssets: [
					'favicon.png',
					'icon_app_192x192.png',
					'icon_app_512x512.png',
					'robots.txt'
				],
				manifest: {
					name: '파티 스케줄러',
					short_name: '파티 스케줄러',
					description: '바쁜 현대인을 위한 스마트한 약속 관리 솔루션',
					theme_color: '#5A0FC8',
					background_color: '#ffffff',
					display: 'standalone',
					start_url: '/',
					scope: '/',
					lang: 'ko',
					orientation: 'portrait',
					icons: [
						{
							src: '/icon_app_192x192.png',
							sizes: '192x192',
							type: 'image/png',
							purpose: 'any maskable'
						},
						{
							src: '/icon_app_512x512.png',
							sizes: '512x512',
							type: 'image/png',
							purpose: 'any maskable'
						}
					],
					screenshots: [
						{
							src: '/screenshots/home_mobile.png',
							sizes: '390x844',
							type: 'image/png',
							form_factor: 'narrow',
							label: '모바일 홈 화면'
						},
						{
							src: '/screenshots/home_desktop.png',
							sizes: '1920x1080',
							type: 'image/png',
							form_factor: 'wide',
							label: '데스크톱 홈 화면'
						}
					]
				},
				workbox: {
					globPatterns: isDev
						? []
						: ['**/*.{js,css,html,ico,png,svg,jpg,jpeg,woff,woff2}'],
					maximumFileSizeToCacheInBytes: 3 * 1024 * 1024 // 3mb
				},
				devOptions: {
					enabled: true,
					type: 'module'
				}
			})
		]
	};
});
