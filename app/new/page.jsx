'use client';

// 글쓰기 페이지
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../components/AuthProvider';

export default function NewPostPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // 비로그인 사용자는 로그인 페이지로 이동
  useEffect(() => {
    if (!loading && !user) router.push('/login');
  }, [loading, user, router]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (url && !/^https?:\/\//.test(url)) {
      setError('URL은 http:// 또는 https:// 로 시작해야 합니다.');
      return;
    }
    setSubmitting(true);
    const { data, error: err } = await supabase
      .from('posts')
      .insert({
        author_id: user.id,
        title: title.trim(),
        url: url.trim() || null,
        content: content.trim() || null,
      })
      .select('id')
      .single();
    setSubmitting(false);
    if (err) {
      setError('글 등록에 실패했습니다: ' + err.message);
      return;
    }
    router.push(`/post/?id=${data.id}`);
  }

  if (loading || !user) return <p className="text-[#828282]">확인 중...</p>;

  return (
    <div className="mx-auto max-w-lg">
      <h1 className="mb-4 font-bold">글쓰기</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <label className="flex flex-col gap-1">
          <span className="text-[#828282]">제목 *</span>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            maxLength={200}
            className="border border-[#828282] bg-white px-2 py-1"
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-[#828282]">링크 URL (선택)</span>
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com"
            className="border border-[#828282] bg-white px-2 py-1"
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-[#828282]">내용 (선택)</span>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={6}
            className="border border-[#828282] bg-white px-2 py-1"
          />
        </label>
        {error && <p className="text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={submitting}
          className="self-start bg-[#ff6600] px-3 py-1 text-white disabled:opacity-50"
        >
          {submitting ? '등록 중...' : '등록'}
        </button>
      </form>
    </div>
  );
}
