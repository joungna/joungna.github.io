'use client';

// 메인 페이지: 글 목록 (최신순)
import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../lib/supabase';
import { toggleVote, fetchMyVotes } from '../lib/votes';
import { useAuth } from '../components/AuthProvider';
import PostItem from '../components/PostItem';

const PAGE_SIZE = 30;

export default function HomePage() {
  const { user } = useAuth();
  const router = useRouter();
  const [posts, setPosts] = useState([]);
  const [myVotes, setMyVotes] = useState({});
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const from = page * PAGE_SIZE;
    const { data, error } = await supabase
      .from('posts_with_meta')
      .select('*')
      .order('created_at', { ascending: false })
      .range(from, from + PAGE_SIZE); // 1개 더 가져와서 다음 페이지 유무 판단
    if (!error && data) {
      setHasMore(data.length > PAGE_SIZE);
      const pageData = data.slice(0, PAGE_SIZE);
      setPosts(pageData);
      if (user) {
        setMyVotes(await fetchMyVotes(user.id, pageData.map((p) => p.id)));
      }
    }
    setLoading(false);
  }, [page, user]);

  useEffect(() => { load(); }, [load]);

  async function handleVote(postId, value) {
    if (!user) { router.push('/login'); return; }
    const ok = await toggleVote(user.id, postId, value, myVotes[postId]);
    if (ok) load(); // 점수 갱신
  }

  if (loading && posts.length === 0) {
    return <p className="text-[#828282]">불러오는 중...</p>;
  }

  return (
    <div>
      {posts.length === 0 ? (
        <p className="text-[#828282]">아직 게시글이 없습니다. 첫 글을 작성해 보세요.</p>
      ) : (
        posts.map((post, i) => (
          <PostItem
            key={post.id}
            post={post}
            rank={page * PAGE_SIZE + i + 1}
            myVote={myVotes[post.id]}
            onVote={handleVote}
          />
        ))
      )}
      <div className="mt-4 ml-7 flex gap-3 text-[#828282]">
        {page > 0 && (
          <button onClick={() => setPage(page - 1)} className="hover:underline">
            ← 이전
          </button>
        )}
        {hasMore && (
          <button onClick={() => setPage(page + 1)} className="hover:underline">
            더 보기 →
          </button>
        )}
      </div>
    </div>
  );
}
