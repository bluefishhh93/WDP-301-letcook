import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PostType } from 'Post';
import { Edit2, Trash2 } from 'lucide-react'; // Assuming you're using lucide-react for icons

interface PostsProps {
  posts: PostType[];
  onEdit: (id: string, updatedPost: Partial<PostType>) => void;
  onDelete: (id: string) => void;
}

const MyPosts: React.FC<PostsProps> = ({ posts, onEdit, onDelete }) => {
  const handleEditPost = (post: PostType) => {
    const updatedTitle = prompt("Edit post title:", post.title);
    const updatedContent = prompt("Edit post content:", post.content);

    if (updatedTitle !== null && updatedContent !== null) {
      onEdit(post._id, { ...post, title: updatedTitle, content: updatedContent });
    }
  };

  return (
    <div className="py-6 md:py-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <Card key={post._id} className="group overflow-hidden transition-all duration-300 hover:shadow-lg">
            <div className="relative aspect-video">
              <img
                src={post.image || "/image-not-found.png"}
                alt={post.title}
                className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <Button variant="ghost" size="sm" className="text-white mr-2" onClick={() => handleEditPost(post)}>
                  <Edit2 className="w-4 h-4 mr-1" /> Edit
                </Button>
                <Button variant="ghost" size="sm" className="text-white" onClick={() => onDelete(post._id)}>
                  <Trash2 className="w-4 h-4 mr-1" /> Delete
                </Button>
              </div>
            </div>
            <CardContent className="p-4">
              <h3 className="text-lg font-bold text-foreground mb-2 line-clamp-1">{post.title}</h3>
              <p className="text-sm text-muted-foreground line-clamp-2">{post.content}</p>
              <div className="mt-3 flex items-center text-xs text-muted-foreground">
                <img src={post.user.avatar} alt={post.user.username} className="w-6 h-6 rounded-full mr-2" />
                <span>{post.user.username}</span>
                <span className="mx-2">•</span>
                <span>{new Date(post.createdAt).toLocaleDateString()}</span>
              </div>
              {post.tags && post.tags.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {post.tags.map((tag, index) => (
                    <span key={index} className="text-xs bg-muted px-2 py-1 rounded-full">{tag.name}</span>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default MyPosts;