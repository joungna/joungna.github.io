# Joungna News

Hacker News 스타일 게시판. Next.js(static export) + Tailwind CSS + Supabase.

## 기능

회원가입 / 로그인 / 로그아웃 (이메일+비밀번호), 글쓰기 / 수정 / 삭제, 댓글 작성 / 삭제, 좋아요 / 싫어요, 글 검색, 내 정보 페이지.

## 구조

```
app/
  page.jsx          글 목록 (메인)
  new/              글쓰기
  post/?id=N        글 상세 + 댓글
  edit/?id=N        글 수정
  login/ signup/    로그인 / 회원가입
  search/           검색
  me/               내 정보
components/         Header, PostItem, AuthProvider
lib/                supabase 클라이언트, 투표 로직
supabase/schema.sql DB 스키마 (테이블 + RLS + 뷰)
```

## 로컬 실행

```bash
# 1. .env.local 생성 (.env.local.example 참고)
# 2. 의존성 설치 후 실행
npm install
npm run dev
```

## GitHub Pages 배포

1. 이 폴더를 `joungna.github.io` 저장소에 푸시 (main 브랜치)
2. 저장소 Settings → Pages → Source: **GitHub Actions** 선택
3. Settings → Secrets and variables → Actions 에 등록:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. 푸시하면 자동 빌드 및 배포

## Supabase 설정

- `supabase/schema.sql` 실행 (테이블, RLS, 트리거, 뷰 생성)
- Authentication → URL Configuration → Site URL: `https://joungna.github.io`
- (선택) Authentication → Providers → Email → Confirm email 끄면 가입 즉시 로그인
