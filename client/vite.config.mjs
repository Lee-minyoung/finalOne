// vite.config.js
import { defineConfig } from 'vite'        // Vite 설정 함수
import vue from '@vitejs/plugin-vue'       // Vue 플러그인
import path from 'node:path'               // 경로 처리용 Node 내장 모듈
import autoprefixer from 'autoprefixer'    // CSS 벤더 프리픽스 자동 추가

// Vite 설정을 export
export default defineConfig(() => {
  return {
     build:
    {
        outDir: '../server/public',
        emptyOutDir: true,
        sourcemap: true
    },
    plugins: [vue()],        // Vue 플러그인 활성화
    base: './',              // 상대 경로로 빌드 (보통 GitHub Pages나 하위 도메인 배포 시 사용)

    css: {
      postcss: {
        plugins: [
          autoprefixer({}),  // CSS에 자동으로 접두사 추가
        ],
      },
    },

    resolve: {
      alias: [
        // SCSS 등에서 ~ 사용 시 제거하고 순수 경로로 변환
        {
          find: /^~(.*)$/,
          replacement: '$1',
        },
        // @/ → src/ 폴더로 매핑 (ex. '@/components/...' → 'src/components/...')
        {
          find: '@/',
          replacement: `${path.resolve(__dirname, 'src')}/`,
        },
        // @ → /src 로도 매핑 (일부 경로 충돌 방지용 중복 설정)
        {
          find: '@',
          replacement: path.resolve(__dirname, '/src'),
        },
      ],
      extensions: [
        '.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue', '.scss'
      ], // 생략 가능한 확장자들
    },

    server: {
      host: 'localhost',
      port: 5173, // 로컬 개발 서버 포트 번호 설정
      open: true,  
      proxy: {
        '/api': {
          target: 'http://localhost:3000',
          changeOrigin: true,
          // rewrite: (path) => path.replace(/^\/api/, ''),
        }
        // API 프록시 설정 자리 (ex. '/api': 'http://localhost:8080')
      },
    },
  }
})
