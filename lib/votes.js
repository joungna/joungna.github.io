// 좋아요/싫어요 공통 로직
import { supabase } from './supabase';

/**
 * 투표 토글:
 * - 같은 값을 다시 누르면 취소(삭제)
 * - 다른 값이면 변경(upsert)
 * @returns 성공 여부
 */
export async function toggleVote(userId, postId, value, currentVote) {
  if (currentVote === value) {
    // 같은 버튼 재클릭 -> 투표 취소
    const { error } = await supabase
      .from('votes')
      .delete()
      .eq('user_id', userId)
      .eq('post_id', postId);
    return !error;
  }
  // 신규 투표 또는 변경
  const { error } = await supabase
    .from('votes')
    .upsert({ user_id: userId, post_id: postId, value });
  return !error;
}

/** 특정 글 목록에 대한 내 투표 조회 -> { postId: value } 맵 반환 */
export async function fetchMyVotes(userId, postIds) {
  if (!userId || postIds.length === 0) return {};
  const { data } = await supabase
    .from('votes')
    .select('post_id, value')
    .eq('user_id', userId)
    .in('post_id', postIds);
  const map = {};
  (data ?? []).forEach((v) => { map[v.post_id] = v.value; });
  return map;
}
