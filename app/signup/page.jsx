'use client';

// 회원가입 (이메일 + 비밀번호 + 닉네임)
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabase';

export default function SignupPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (username.trim().length < 2) {
      setError('닉네임은 2자 이상이어야 합니다.');
      return;
    }
    setSubmitting(true);
    // 닉네임은 user_metadata로 전달 -> DB 트리거가 profiles에 자동 저장
    const { data, error: err } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { username: username.trim() } },
    });
    setSubmitting(false);
    if (err) {
      setError(err.message);
      return;
    }
    if (data.session) {
      router.push('/'); // 이메일 확인 비활성화 시 즉시 로그인됨
    } else {
      setMessage('가입 확인 이메일을 발송했습니다. 메일함을 확인해 주세요.');
    }
  }

  return (
    <div className="mx-auto max-w-sm">
      <h1 className="mb-4 font-bold">회원가입</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <label className="flex flex-col gap-1">
          <span className="text-[#828282]">닉네임</span>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            maxLength={20}
            className="border border-[#828282] bg-white px-2 py-1"
          />
        </label>
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
          <span className="text-[#828282]">비밀번호 (6자 이상)</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            className="border border-[#828282] bg-white px-2 py-1"
          />
        </label>
        {error && <p className="text-red-600">{error}</p>}
        {message && <p className="text-green-700">{message}</p>}
        <button
          type="submit"
          disabled={submitting}
          className="bg-[#ff6600] px-3 py-1 text-white disabled:opacity-50"
        >
          {submitting ? '가입 중...' : '가입하기'}
        </button>
      </form>
      <p className="mt-3 text-[#828282]">
        이미 계정이 있으신가요?{' '}
        <Link href="/login" className="underline">로그인</Link>
      </p>
    </div>
  );
}
