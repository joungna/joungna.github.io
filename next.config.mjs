/** @type {import('next').NextConfig} */
const nextConfig = {
  // GitHub Pages는 정적 호스팅이므로 static export 사용
  output: 'export',
  // /login/ -> /login/index.html 형태로 생성 (GitHub Pages 라우팅 호환)
  trailingSlash: true,
  // 정적 export에서는 next/image 최적화 서버가 없으므로 비활성화
  images: { unoptimized: true },
};

export default nextConfig;
