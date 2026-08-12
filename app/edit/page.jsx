'use client';

// 글 수정 페이지 (?id=글번호)
import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../components/AuthProvider';

function EditForm() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // 기존 글 불러오기 + 작성자 확인
  useEffect(() => {
    if (authLoading || !id) return;
    if (!user) { router.push('/login'); return; }
    supabase
      .from('posts')
      .select('*')
      .eq('id', id)
      .maybeSingle()
      .then(({ data }) => {
        if (!data) { setError('글을 찾을 수 없습니다.'); setLoading(false); return; }
        if (data.author_id !== user.id) { router.push(`/post/?id=${id}`); return; }
        setTitle(data.title);
        setUrl(data.url ?? '');
        setContent(data.content ?? '');
        setLoading(false);
      });
  }, [authLoading, user, id, router]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (url && !/^https?:\/\//.test(url)) {
      setError('URL은 http:// 또는 https:// 로 시작해야 합니다.');
      return;
    }
    setSubmitting(true);
    const { error: err } = await supabase
      .from('posts')
      .update({
        title: title.trim(),
        url: url.trim() || null,
        content: content.trim() || null,
      })
      .eq('id', id);
    setSubmitting(false);
    if (err) { setError('수정에 실패했습니다: ' + err.message); return; }
    router.push(`/post/?id=${id}`);
  }

  if (!id) return <p className="text-[#828282]">잘못된 접근입니다.</p>;
  if (loading) return <p className="text-[#828282]">불러오는 중...</p>;

  return (
    <div className="mx-auto max-w-lg">
      <h1 className="mb-4 font-bold">글 수정</h1>
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
          {submitting ? '저장 중...' : '저장'}
        </button>
      </form>
    </div>
  );
}

export default function EditPage() {
  return (
    <Suspense fallback={<p className="text-[#828282]">불러오는 중...</p>}>
      <EditForm />
    </Suspense>
  );
}
