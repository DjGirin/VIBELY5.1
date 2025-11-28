import { useRef, useCallback } from 'react';

interface UseInfiniteScrollProps {
  isLoading: boolean;
  hasNextPage: boolean;
  fetchNextPage: () => void;
  rootMargin?: string;
}

export const useInfiniteScroll = ({
  isLoading,
  hasNextPage,
  fetchNextPage,
  rootMargin = '200px',
}: UseInfiniteScrollProps) => {
  // Fix: Explicitly initialize useRef with null to prevent type errors with some TypeScript/React versions.
  const observer = useRef<IntersectionObserver | null>(null);

  const lastElementRef = useCallback(
    (node: HTMLElement | null) => {
      if (isLoading) return;

      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasNextPage) {
            fetchNextPage();
          }
        },
        { rootMargin }
      );

      if (node) observer.current.observe(node);
    },
    [isLoading, hasNextPage, fetchNextPage, rootMargin]
  );

  return { lastElementRef };
};
