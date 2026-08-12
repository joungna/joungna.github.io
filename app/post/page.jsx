'use client';

// 글 상세 페이지: 본문 + 좋아요/싫어요 + 댓글
import { Suspense, useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase, timeAgo, getDomain } from '../../lib/supabase';
import { toggleVote, fetchMyVotes } from '../../lib/votes';
import { useAuth } from '../../components/AuthProvider';

function PostDetail() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const { user } = useAuth();
  const router = useRouter();

  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [myVote, setMyVote] = useState(undefined);
  const [commentText, setCommentText] = useState('');
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const load = useCallback(async () => {
    if (!id) return;
    const [{ data: p }, { data: c }] = await Promise.all([
      supabase.from('posts_with_meta').select('*').eq('id', id).maybeSingle(),
      supabase
        .from('comments')
        .select('*, profiles(username)')
        .eq('post_id', id)
        .order('created_at', { ascending: true }),
    ]);
    if (!p) { setNotFound(true); setLoading(false); return; }
    setPost(p);
    setComments(c ?? []);
    if (user) {
      const votes = await fetchMyVotes(user.id, [p.id]);
      setMyVote(votes[p.id]);
    }
    setLoading(false);
  }, [id, user]);

  useEffect(() => { load(); }, [load]);

  async function handleVote(value) {
    if (!user) { router.push('/login'); return; }
    const ok = await toggleVote(user.id, post.id, value, myVote);
    if (ok) load();
  }

  async function handleDeletePost() {
    if (!confirm('이 글을 삭제하시겠습니까? 댓글도 함께 삭제됩니다.')) return;
    const { error } = await supabase.from('posts').delete().eq('id', post.id);
    if (!error) router.push('/');
  }

  async function handleAddComment(e) {
    e.preventDefault();
    if (!user) { router.push('/login'); return; }
    const text = commentText.trim();
    if (!text) return;
    const { error } = await supabase
      .from('comments')
      .insert({ post_id: post.id, author_id: user.id, content: text });
    if (!error) {
      setCommentText('');
      load();
    }
  }

  async function handleDeleteComment(commentId) {
    if (!confirm('댓글을 삭제하시겠습니까?')) return;
    const { error } = await supabase.from('comments').delete().eq('id', commentId);
    if (!error) load();
  }

  if (!id) return <p className="text-[#828282]">잘못된 접근입니다.</p>;
  if (loading) return <p className="text-[#828282]">불러오는 중...</p>;
  if (notFound) return <p className="text-[#828282]">글을 찾을 수 없습니다.</p>;

  const domain = post.url ? getDomain(post.url) : null;
  const isAuthor = user && user.id === post.author_id;

  return (
    <div>
      {/* 글 헤더 */}
      <div className="flex items-start gap-1">
        <div className="flex w-4 shrink-0 flex-col items-center leading-none">
          <button
            title="좋아요"
            onClick={() => handleVote(1)}
            className={`text-[10px] ${myVote === 1 ? 'text-[#ff6600]' : 'text-[#828282] hover:text-[#ff6600]'}`}
          >
            ▲
          </button>
          <button
            title="싫어요"
            onClick={() => handleVote(-1)}
            className={`text-[10px] ${myVote === -1 ? 'text-[#ff6600]' : 'text-[#828282] hover:text-[#ff6600]'}`}
          >
            ▼
          </button>
        </div>
        <div className="min-w-0">
          <div className="font-medium">
            {post.url ? (
              <a href={post.url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                {post.title}
              </a>
            ) : (
              post.title
            )}
            {domain && <span className="ml-1 text-[11px] font-normal text-[#828282]">({domain})</span>}
          </div>
          <div className="text-[11px] text-[#828282]">
            {post.score}점 · {post.username} · {timeAgo(post.created_at)}
            {isAuthor && (
              <>
                {' · '}
                <Link href={`/edit/?id=${post.id}`} className="hover:underline">수정</Link>
                {' · '}
                <button onClick={handleDeletePost} className="hover:underline">삭제</button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* 본문 */}
      {post.content && (
        <p className="mt-3 ml-5 whitespace-pre-wrap">{post.content}</p>
      )}

      {/* 댓글 입력 */}
      <form onSubmit={handleAddComment} className="mt-5 ml-5">
        <textarea
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          rows={3}
          placeholder={user ? '댓글을 입력하세요' : '댓글을 쓰려면 로그인하세요'}
          disabled={!user}
          className="w-full max-w-lg border border-[#828282] bg-white px-2 py-1 disabled:bg-gray-100"
        />
        <div>
          <button
            type="submit"
            disabled={!user || !commentText.trim()}
            className="mt-1 bg-[#ff6600] px-3 py-1 text-white disabled:opacity-50"
          >
            댓글 등록
          </button>
        </div>
      </form>

      {/* 댓글 목록 */}
      <div className="mt-5 ml-5 flex flex-col gap-3">
        {comments.map((c) => (
          <div key={c.id}>
            <div className="text-[11px] text-[#828282]">
              {c.profiles?.username ?? '알 수 없음'} · {timeAgo(c.created_at)}
              {user && user.id === c.author_id && (
                <>
                  {' · '}
                  <button onClick={() => handleDeleteComment(c.id)} className="hover:underline">
                    삭제
                  </button>
                </>
              )}
            </div>
            <p className="whitespace-pre-wrap">{c.content}</p>
          </div>
        ))}
        {comments.length === 0 && (
          <p className="text-[11px] text-[#828282]">아직 댓글이 없습니다.</p>
        )}
      </div>
    </div>
  );
}

// static export에서 useSearchParams 사용 시 Suspense 필요
export default function PostPage() {
  return (
    <Suspense fallback={<p className="text-[#828282]">불러오는 중...</p>}>
      <PostDetail />
    </Suspense>
  );
}
