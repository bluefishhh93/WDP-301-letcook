'use client';

import PagePagination from '@/components/ui.custom/page-pagination';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import axios from '@/lib/axios';
import { formatISODateToLongDate } from '@/utils/date.utils';
import { getInitials } from '@/utils/string.utils';
import Link from 'next/link';
import { PostType } from 'Post';
import { useEffect, useState } from 'react';


import { useSession } from 'next-auth/react';
import { ArrowRight } from 'lucide-react';

export default function ListPost({
  tag,
  page,
}: {
  tag?: string | null;
  page: number;
}) {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [posts, setPosts] = useState<PostType[]>([]);
  const [total, setTotal] = useState<number>(0);
  const take = 6;
  useEffect(() => {
    const fetching = async () => {
      try {
        const queryParams = [];
        if (tag) {
          queryParams.push(`tag=${tag}`);
        }
        if (page) {
          queryParams.push(`take=${take}`);
          queryParams.push(`skip=${(page - 1) * take}`);
        }
        const queryString =
          queryParams.length > 0 ? `?${queryParams.join('&')}` : '';
        const res = await axios.get(`/api/post/${queryString}`);
        setPosts(res.data.post);
        setTotal(res.data.total);
        setIsLoading(false);
      } catch (error) {}
    };
    fetching();
    return () => {
      setPosts([]);
    };
  }, [tag, page]);
  // console.log(total, page);
  return (
    <div className="container mx-auto px-4 py-12 md:px-6 lg:py-16">
      <BreadcrumbPost />
      {!isLoading && posts.length > 0 && (
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-8 text-gray-800 dark:text-gray-100">
            Featured Post
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="relative h-[400px] rounded-xl overflow-hidden">
              <img
                src={posts[0].image}
                alt={posts[0].title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex flex-col justify-center space-y-4">
              <div className="flex items-center space-x-4">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={posts[0].user.avatar} />
                  <AvatarFallback>{getInitials(posts[0].user.username)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-gray-800 dark:text-gray-200">
                    {posts[0].user.username}
                  </p>
                  <p className="text-sm text-gray-500">
                    {formatISODateToLongDate(posts[0].createdAt)}
                  </p>
                </div>
              </div>
              <h3 className="text-4xl font-bold text-gray-900 dark:text-gray-100">
                {posts[0].title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 line-clamp-3">
                {/* {posts[0].description} */}
              </p>
              <div className="flex flex-wrap gap-2">
                {posts[0].tags?.map((tag) => (
                  <Link
                    key={tag.name}
                    href={`/post?tag=${tag.name}`}
                    className="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                  >
                    {tag.name}
                  </Link>
                ))}
              </div>
              <Link
                href={`/post/${posts[0]._id}`}
                className="inline-flex items-center space-x-2 text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
              >
                <span>Read More</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Recent Posts Grid */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-8 text-gray-800 dark:text-gray-100">
          Recent Posts
        </h2>
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array(6).fill(null).map((_, i) => (
              <PostSkeleton key={i} index={i} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.slice(1).map((post) => (
              <PostCard key={post._id} post={post} />
            ))}
          </div>
        )}
      </div>
      <Separator className="my-6" />
      <PagePagination
        page={page}
        totalPage={Math.ceil(total / take)}
        href={`/post${tag ? `?tag=${tag}` : ''}`}
      />
    </div>
  );
}

export function PostSkeleton({ index }: any) {
  return (
    <div
      key={index}
      className="rounded-lg bg-white shadow-md transition-transform duration-300 dark:bg-gray-800"
    >
      <div className="relative h-48 overflow-hidden rounded-t-lg">
        <Skeleton className="h-full w-full rounded-t-lg" />
      </div>
      <div className="p-4">
        <div className="mb-2 flex items-center">
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="ml-2 h-4 w-24" />
        </div>
        <Skeleton className="mb-2 h-6 w-full" />
        <Skeleton className="mb-4 h-4 w-full" />
        <div className="flex flex-wrap gap-2">
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-6 w-20" />
        </div>
      </div>
    </div>
  );
}

interface UserType {
  id: string;
  username: string;
  avatar: string;
  email: string;
}
export function PostCard({ post }: { post: PostType }) {
  const { data: session } = useSession();
  const [userId, setUserId] = useState<string | null>(null);
  const [isFollowing, setIsFollowing] = useState<boolean>(false);
  const [followedUsers, setFollowedUsers] = useState<string[]>([]);

  // Sử dụng useEffect để cập nhật userId khi session thay đổi
  useEffect(() => {
    if (session?.user.id) {
      setUserId(session.user.id);
      fetchFollowedUsers(session.user.id);
    }
  }, [session]);

  // Hàm fetch danh sách người dùng đã được follow
  const fetchFollowedUsers = async (userId: string) => {
    try {
      const response = await axios.get(`/api/users/following/${userId}`);
      const followedUserIds = response.data.map((user: UserType) => user.id);
      setFollowedUsers(followedUserIds);

      // Kiểm tra xem người dùng của post hiện tại có nằm trong danh sách không
      setIsFollowing(followedUserIds.includes(post.user.id));
    } catch (error) {
      console.error('Error fetching followed users:', error);
    }
  };


  const handleFollow = async (e: React.MouseEvent<HTMLButtonElement>, authorId: string) => {
    e.preventDefault();

    try {
      const response = await axios.put(`/api/users/following/${userId}`, {
        followedUserId: authorId,
      });

      // Cập nhật trạng thái theo dõi sau khi nhận phản hồi từ API
      if (isFollowing) {
        // Nếu đang theo dõi, sau khi unfollow thì xóa authorId khỏi danh sách followedUsers
        setFollowedUsers((prev) => prev.filter((id) => id !== authorId));
      } else {
        // Nếu chưa theo dõi, sau khi follow thì thêm authorId vào danh sách followedUsers
        setFollowedUsers((prev) => [...prev, authorId]);
      }
      setIsFollowing(!isFollowing);
    } catch (error) {
      console.error('Error following/unfollowing user:', error);
    }
  };

  const handleShare = async (e: React.MouseEvent<HTMLButtonElement>, postId: string) => {
    e.preventDefault();

    const postUrl = `${window.location.origin}/post/${postId}`;
    try {
      await navigator.clipboard.writeText(postUrl);
      if (navigator.share) {
        await navigator.share({
          title: 'Check out this post!',
          text: 'Take a look at this amazing blog post!',
          url: postUrl,
        });
      } else {
        const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(postUrl)}`;
        window.open(facebookUrl, '_blank', 'noopener,noreferrer');
      }
    } catch (error) {
      console.error('Error sharing post:', error);
    }
  };

  return (
    <Link
      href={`/post/${post._id}`}
      passHref
      className="rounded-lg bg-white shadow-md transition-transform duration-300 hover:-translate-y-2 dark:bg-gray-800"
    >
      <div className="rounded-lg bg-white shadow-md transition-transform duration-300 hover:-translate-y-2 dark:bg-gray-800">
        <div className="relative h-48 overflow-hidden rounded-t-lg">
          <img
            src={post.image}
            alt="Blog Post Image"
            width={640}
            height={360}
            className="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
          />
        </div>

        <div className="p-4">
          <div className="mb-2 flex items-center">
            <Link href="#" className="mr-2 flex items-center" prefetch={false}>
              <Avatar className="h-8 w-8 rounded-full">
                <AvatarImage src={post.user.avatar} />
                <AvatarFallback>
                  {getInitials(post.user.username)}
                </AvatarFallback>
              </Avatar>
              <span className="ml-2 text-sm font-medium">
                {post.user.username}
              </span>
            </Link>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {formatISODateToLongDate(post.createdAt)}
            </span>

            {/* Chỉ hiển thị nút Follow nếu userId khác với post.user.id */}
            {post.user.id !== userId && (
              <button
                onClick={(e) => handleFollow(e, post.user.id)}
                className={`ml-2 px-4 py-2 text-sm font-medium text-white transition-colors duration-300 ${
                  isFollowing ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'
                }`}
              >
                {isFollowing ? 'Unfollow' : 'Follow'}
              </button>
            )}
            <button
              onClick={(e) => handleShare(e, post._id)}
              className="ml-2 px-4 py-2 text-sm font-medium text-white transition-colors duration-300 bg-blue-500"
            >
              Share
            </button>
          </div>

          <h3 className="mb-2 text-xl font-bold transition-colors duration-300 hover:text-primary-500 dark:hover:text-primary-400">
            {post.title}
          </h3>

          <p className="mb-4 text-gray-500 dark:text-gray-400">
            Learn the essential steps to create a thriving blog and build a loyal audience.
          </p>
          <Tags tags={post.tags} />
        </div>
      </div>
    </Link>
  );
}


export function BreadcrumbPost() {
  return (
    <div className="py-8">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink className="text-xl" asChild>
              <Link href="/">Home</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink className="text-xl" asChild>
              <Link href="/post">Post</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
}
export function Tags({ tags }: { tags?: { name: string }[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {tags &&
        tags.slice(0, 3).map((tag, index) => (
          <div key={tag.name}>
            <Link
              href={`/post?tag=${tag.name}`}
              className="rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700 transition-colors duration-300 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
              prefetch={false}
            >
              {tag.name}
            </Link>
          </div>
        ))}
    </div>
  );
}
