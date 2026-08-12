'use client';

// HN 스타일 상단 오렌지 바
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthProvider';

export default function Header() {
  const { user, profile } = useAuth();
  const router = useRouter();

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push('/');
  }

  return (
    <header className="bg-[#ff6600] px-2 py-1">
      <div className="flex flex-wrap items-center gap-x-2 text-[13px]">
        <Link href="/" className="flex items-center gap-1 font-bold text-black">
          <span className="border border-white px-1 text-white">J</span>
          <span>Joungna News</span>
        </Link>
        <nav className="flex items-center gap-x-1 text-black">
          <Link href="/" className="hover:underline">새 글</Link>
          <span>|</span>
          <Link href="/new" className="hover:underline">글쓰기</Link>
          <span>|</span>
          <Link href="/search" className="hover:underline">검색</Link>
        </nav>
        <div className="ml-auto flex items-center gap-x-1 text-black">
          {user ? (
            <>
              <Link href="/me" className="hover:underline">
                {profile?.username ?? '내 정보'}
              </Link>
              <span>|</span>
              <button onClick={handleLogout} className="hover:underline">
                로그아웃
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="hover:underline">로그인</Link>
              <span>|</span>
              <Link href="/signup" className="hover:underline">회원가입</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
