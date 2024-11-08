'use client';
import axios from '@/lib/axios';
import { CommentType } from 'Post';
import { ReactNode, useCallback, useEffect, useRef, useState } from 'react';
import Comment, { AddComment } from '../components/Comment';
import { CommentRef } from '../post';

interface CommentProps {
  id: string;
}

/**
 * Comment tree component to render all comments
 * @param id
 * @returns
 */
export default function CommentTree({ id }: CommentProps) {
  const rendedComments: { [key: string]: boolean } = {};
  const [comments, setComments] = useState<CommentType[]>([]);
  const commentRef = useRef<CommentRef | any>({ refresh: () => {} });

  const traverseComments = (currentComments: CommentType[], level: number) => {
    const result: ReactNode[] = [];
    for (const comment of currentComments) {
      const { _id } = comment; // Chỉ giữ lại _id
      if (rendedComments[_id]) {
        continue;
      }
      rendedComments[_id] = true;
      result.push(
        <div key={comment._id}>
          <Comment
            comment={comment}
            level={level}
            postId={id}
            ref={commentRef}
          />
        </div>
      );
    }
    return result;
  };

  const fetchComments = useCallback(async () => {
    try {
      const res = await axios.get(`/api/comment/${id}`);
      const comments = res.data;
      setComments(comments);
    } catch (error) {}
  }, [id]);

  useEffect(() => {
    fetchComments();
    return () => {
      setComments([]);
    };
  }, [id]);

  useEffect(() => {
    if (!commentRef.current) return;
    commentRef.current.refresh = fetchComments;
  }, [commentRef]);

  if (!comments) return null;
  return (
    <div className="space-y-4">
      <AddComment postId={id} ref={commentRef} />
      {traverseComments(comments, 0)}
    </div>
  );
}