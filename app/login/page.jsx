'use client';

// 로그인 (이메일 + 비밀번호)
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabase';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    const { error: err } = await supabase.auth.signInWithPassword({ email, password });
    setSubmitting(false);
    if (err) {
      setError('이메일 또는 비밀번호가 올바르지 않습니다.');
      return;
    }
    router.push('/');
  }

  return (
    <div className="mx-auto max-w-sm">
      <h1 className="mb-4 font-bold">로그인</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <label className="flex flex-col gap-1">
          <span className="text-[#828282]">이메일</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="border border-[#828282] bg-white px-2 py-1"
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-[#828282]">비밀번호</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="border border-[#828282] bg-white px-2 py-1"
          />
        </label>
        {error && <p className="text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={submitting}
          className="bg-[#ff6600] px-3 py-1 text-white disabled:opacity-50"
        >
          {submitting ? '로그인 중...' : '로그인'}
        </button>
      </form>
      <p className="mt-3 text-[#828282]">
        계정이 없으신가요?{' '}
        <Link href="/signup" className="underline">회원가입</Link>
      </p>
    </div>
  );
}
