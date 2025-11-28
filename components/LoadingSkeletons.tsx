import React from 'react';

export const FeedItemSkeleton = () => (
  <div className="bg-light-surface rounded-xl border border-light-border overflow-hidden animate-pulse">
    <div className="p-4 flex items-center space-x-3">
      <div className="h-11 w-11 rounded-full bg-gray-200" />
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-gray-200 rounded w-1/3" />
        <div className="h-3 bg-gray-200 rounded w-1/4" />
      </div>
    </div>
    <div className="aspect-square bg-gray-200" />
    <div className="p-4 space-y-4">
      <div className="h-10 bg-gray-200 rounded-lg" />
      <div className="h-16 bg-gray-200 rounded-lg" />
      <div className="flex justify-between">
        <div className="h-8 w-1/2 bg-gray-200 rounded-lg" />
        <div className="h-8 w-1/4 bg-gray-200 rounded-lg" />
      </div>
    </div>
  </div>
);