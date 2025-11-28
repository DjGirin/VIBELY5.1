import React, { useState, useEffect } from 'react';
import { Post, User, Media } from '../types';
import { fetchPosts } from '../data';
import FeedItem from './FeedItem';
import { FeedItemSkeleton } from './LoadingSkeletons';
import { useInfiniteScroll } from '../hooks/useInfiniteScroll';

interface FeedProps {
    onNavigateToProfile: (userId: string) => void;
    currentUser: User;
    currentTrack: Media | null;
    isPlaying: boolean;
    onSetTrack: (track: Media) => void;
    playbackTime: number;
    playbackDuration: number;
    onSeekToTime: (time: number) => void;
    onNavigateToProject: (projectId: string) => void;
}

const Feed: React.FC<FeedProps> = ({ 
    onNavigateToProfile, 
    currentUser, 
    currentTrack, 
    isPlaying, 
    onSetTrack,
    playbackTime,
    playbackDuration,
    onSeekToTime,
    onNavigateToProject
}) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const loadMorePosts = React.useCallback(async () => {
    if (isLoading || !hasMore) return;
    setIsLoading(true);
    const { data: newPosts, hasMore: newHasMore } = await fetchPosts(page);
    setPosts(prevPosts => [...prevPosts, ...newPosts]);
    setHasMore(newHasMore);
    setPage(prevPage => prevPage + 1);
    setIsLoading(false);
  }, [isLoading, hasMore, page]);
  
  useEffect(() => {
    loadMorePosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { lastElementRef } = useInfiniteScroll({
    isLoading,
    hasNextPage: hasMore,
    fetchNextPage: loadMorePosts,
  });

  return (
    <main className="flex-1 max-w-2xl mx-auto p-4 space-y-6">
      {posts.map((post, index) => (
         <div key={post.id} ref={index === posts.length - 1 ? lastElementRef : null}>
            <FeedItem 
                post={post} 
                onNavigateToProfile={onNavigateToProfile}
                currentUser={currentUser}
                currentTrack={currentTrack}
                isPlaying={isPlaying}
                onSetTrack={onSetTrack}
                playbackTime={playbackTime}
                playbackDuration={playbackDuration}
                onSeekToTime={onSeekToTime}
                onNavigateToProject={onNavigateToProject}
            />
         </div>
      ))}
      {isLoading && Array.from({ length: 3 }).map((_, i) => <FeedItemSkeleton key={`skeleton-${i}`} />)}
      {!hasMore && posts.length > 0 && <p className="text-center text-light-text-secondary py-8">You've reached the end!</p>}
    </main>
  );
};

export default Feed;
