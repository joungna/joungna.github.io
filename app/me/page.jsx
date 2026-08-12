'use client';

// 내 정보 페이지: 프로필 확인/닉네임 변경 + 내가 쓴 글/댓글
import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase, timeAgo } from '../../lib/supabase';
import { useAuth } from '../../components/AuthProvider';

export default function MePage() {
  const { user, profile, loading } = useAuth();
  const router = useRouter();

  const [myPosts, setMyPosts] = useState([]);
  const [myComments, setMyComments] = useState([]);
  const [newUsername, setNewUsername] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!loading && !user) router.push('/login');
  }, [loading, user, router]);

  useEffect(() => {
    if (profile) setNewUsername(profile.username);
  }, [profile]);

  const loadMyContent = useCallback(async () => {
    if (!user) return;
    const [{ data: posts }, { data: comments }] = await Promise.all([
      supabase
        .from('posts_with_meta')
        .select('*')
        .eq('author_id', user.id)
        .order('created_at', { ascending: false }),
      supabase
        .from('comments')
        .select('*, posts(title)')
        .eq('author_id', user.id)
        .order('created_at', { ascending: false })
        .limit(30),
    ]);
    setMyPosts(posts ?? []);
    setMyComments(comments ?? []);
  }, [user]);

  useEffect(() => { loadMyContent(); }, [loadMyContent]);

  async function handleUpdateUsername(e) {
    e.preventDefault();
    setMessage('');
    const name = newUsername.trim();
    if (name.length < 2) { setMessage('닉네임은 2자 이상이어야 합니다.'); return; }
    const { error } = await supabase
      .from('profiles')
      .update({ username: name })
      .eq('id', user.id);
    setMessage(error ? '변경 실패: 이미 사용 중인 닉네임일 수 있습니다.' : '닉네임이 변경되었습니다. 새로고침 후 반영됩니다.');
  }

  if (loading || !user) return <p className="text-[#828282]">확인 중...</p>;

  return (
    <div className="flex flex-col gap-6">
      {/* 프로필 */}
      <section>
        <h1 className="mb-2 font-bold">내 정보</h1>
        <table className="text-[13px]">
          <tbody>
            <tr>
              <td className="pr-4 text-[#828282]">닉네임</td>
              <td>{profile?.username}</td>
            </tr>
            <tr>
              <td className="pr-4 text-[#828282]">이메일</td>
              <td>{user.email}</td>
            </tr>
            <tr>
              <td className="pr-4 text-[#828282]">가입일</td>
              <td>{new Date(user.created_at).toLocaleDateString('ko-KR')}</td>
            </tr>
          </tbody>
        </table>
        <form onSubmit={handleUpdateUsername} className="mt-3 flex items-center gap-2">
          <input
            type="text"
            value={newUsername}
            onChange={(e) => setNewUsername(e.target.value)}
            maxLength={20}
            className="border border-[#828282] bg-white px-2 py-1"
          />
          <button type="submit" className="bg-[#ff6600] px-3 py-1 text-white">
            닉네임 변경
          </button>
        </form>
        {message && <p className="mt-1 text-[#828282]">{message}</p>}
      </section>

      {/* 내가 쓴 글 */}
      <section>
        <h2 className="mb-2 font-bold">내가 쓴 글 ({myPosts.length})</h2>
        {myPosts.length === 0 ? (
          <p className="text-[#828282]">작성한 글이 없습니다.</p>
        ) : (
          myPosts.map((p) => (
            <div key={p.id} className="mb-1">
              <Link href={`/post/?id=${p.id}`} className="hover:underline">
                {p.title}
              </Link>
              <span className="ml-2 text-[11px] text-[#828282]">
                {p.score}점 · 댓글 {p.comment_count}개 · {timeAgo(p.created_at)}
              </span>
            </div>
          ))
        )}
      </section>

      {/* 내가 쓴 댓글 */}
      <section>
        <h2 className="mb-2 font-bold">내가 쓴 댓글 ({myComments.length})</h2>
        {myComments.length === 0 ? (
          <p className="text-[#828282]">작성한 댓글이 없습니다.</p>
        ) : (
          myComments.map((c) => (
            <div key={c.id} className="mb-2">
              <p className="whitespace-pre-wrap">{c.content}</p>
              <p className="text-[11px] text-[#828282]">
                <Link href={`/post/?id=${c.post_id}`} className="hover:underline">
                  {c.posts?.title ?? '(삭제된 글)'}
                </Link>
                {' · '}{timeAgo(c.created_at)}
              </p>
            </div>
          ))
        )}
      </section>
    </div>
  );
}
