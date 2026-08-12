'use client';

// 목록에 표시되는 글 한 줄 (HN 스타일)
import Link from 'next/link';
import { timeAgo, getDomain } from '../lib/supabase';

export default function PostItem({ post, rank, myVote, onVote }) {
  const domain = post.url ? getDomain(post.url) : null;

  return (
    <div className="mb-1.5 flex items-start gap-1">
      {/* 순위 */}
      <span className="w-6 shrink-0 text-right text-[#828282]">
        {rank ? `${rank}.` : ''}
      </span>

      {/* 좋아요/싫어요 화살표 */}
      <div className="flex w-4 shrink-0 flex-col items-center leading-none">
        <button
          title="좋아요"
          onClick={() => onVote(post.id, 1)}
          className={`text-[10px] ${myVote === 1 ? 'text-[#ff6600]' : 'text-[#828282] hover:text-[#ff6600]'}`}
        >
          ▲
        </button>
        <button
          title="싫어요"
          onClick={() => onVote(post.id, -1)}
          className={`text-[10px] ${myVote === -1 ? 'text-[#ff6600]' : 'text-[#828282] hover:text-[#ff6600]'}`}
        >
          ▼
        </button>
      </div>

      {/* 제목 + 메타 정보 */}
      <div className="min-w-0">
        <div>
          {post.url ? (
            <a href={post.url} target="_blank" rel="noopener noreferrer" className="text-black visited:text-[#828282] hover:underline">
              {post.title}
            </a>
          ) : (
            <Link href={`/post/?id=${post.id}`} className="text-black hover:underline">
              {post.title}
            </Link>
          )}
          {domain && (
            <span className="ml-1 text-[11px] text-[#828282]">({domain})</span>
          )}
        </div>
        <div className="text-[11px] text-[#828282]">
          {post.score}점 · {post.username} · {timeAgo(post.created_at)} ·{' '}
          <Link href={`/post/?id=${post.id}`} className="hover:underline">
            댓글 {post.comment_count}개
          </Link>
        </div>
      </div>
    </div>
  );
}
