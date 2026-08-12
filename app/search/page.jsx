'use client';

// 글 검색 페이지 (제목 + 내용 검색)
import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '../../lib/supabase';
import { toggleVote, fetchMyVotes } from '../../lib/votes';
import { useAuth } from '../../components/AuthProvider';
import PostItem from '../../components/PostItem';

function SearchContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') ?? '';
  const { user } = useAuth();
  const router = useRouter();

  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState(null); // null = 검색 전
  const [myVotes, setMyVotes] = useState({});
  const [searching, setSearching] = useState(false);

  async function runSearch(q) {
    const keyword = q.trim();
    if (!keyword) return;
    setSearching(true);
    // 제목 또는 내용에 키워드가 포함된 글 검색 (대소문자 무시)
    const { data } = await supabase
      .from('posts_with_meta')
      .select('*')
      .or(`title.ilike.%${keyword}%,content.ilike.%${keyword}%`)
      .order('created_at', { ascending: false })
      .limit(50);
    setResults(data ?? []);
    if (user && data?.length) {
      setMyVotes(await fetchMyVotes(user.id, data.map((p) => p.id)));
    }
    setSearching(false);
  }

  // URL에 ?q= 가 있으면 자동 검색
  useEffect(() => {
    if (initialQuery) runSearch(initialQuery);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialQuery]);

  function handleSubmit(e) {
    e.preventDefault();
    router.push(`/search/?q=${encodeURIComponent(query.trim())}`);
    runSearch(query);
  }

  async function handleVote(postId, value) {
    if (!user) { router.push('/login'); return; }
    const ok = await toggleVote(user.id, postId, value, myVotes[postId]);
    if (ok) runSearch(query || initialQuery);
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className="mb-4 flex gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="검색어 입력"
          className="w-64 border border-[#828282] bg-white px-2 py-1"
        />
        <button type="submit" className="bg-[#ff6600] px-3 py-1 text-white">
          검색
        </button>
      </form>

      {searching && <p className="text-[#828282]">검색 중...</p>}
      {results !== null && !searching && (
        results.length === 0 ? (
          <p className="text-[#828282]">검색 결과가 없습니다.</p>
        ) : (
          results.map((post, i) => (
            <PostItem
              key={post.id}
              post={post}
              rank={i + 1}
              myVote={myVotes[post.id]}
              onVote={handleVote}
            />
          ))
        )
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<p className="text-[#828282]">불러오는 중...</p>}>
      <SearchContent />
    </Suspense>
  );
}
