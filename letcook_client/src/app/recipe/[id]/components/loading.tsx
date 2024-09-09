import React from 'react';

const Loading: React.FC = () => {
  return (
    <div className="bg-background text-foreground min-h-screen">
      <div className="container mx-auto px-4 py-12">
        {/* Hero Section Skeleton */}
        <div className="mb-12 flex flex-col md:flex-row gap-6">
          <div className="md:w-1/3">
            <div className="w-full h-64 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
          </div>
          <div className="md:w-2/3">
            <div className="h-10 w-3/4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-4"></div>
            <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2"></div>
            <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2"></div>
            <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            <div className="mt-6 p-4 border-t border-gray-200 dark:border-gray-700 flex items-center">
              <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
              <div className="ml-4">
                <div className="h-6 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2"></div>
                <div className="h-8 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-2/3">
            {/* Quick Facts Skeleton */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
              {[...Array(4)].map((_, index) => (
                <div key={index} className="bg-gray-200 dark:bg-gray-700 rounded-lg p-4 animate-pulse">
                  <div className="h-4 w-16 bg-gray-300 dark:bg-gray-600 rounded mb-2"></div>
                  <div className="h-6 w-12 bg-gray-300 dark:bg-gray-600 rounded"></div>
                </div>
              ))}
            </div>

            {/* Instructions Skeleton */}
            <div className="space-y-8">
              {[...Array(3)].map((_, index) => (
                <div key={index} className="flex flex-col gap-3">
                  <div className="flex items-center gap-4">
                    <div className="w-6 h-6 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
                    <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                  </div>
                  <div className="flex flex-wrap gap-4">
                    {[...Array(2)].map((_, imgIndex) => (
                      <div key={imgIndex} className="w-full md:w-1/4 h-48 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar Skeleton */}
          <div className="lg:w-1/3">
            <div className="space-y-8">
              <div className="bg-gray-200 dark:bg-gray-700 rounded-lg p-6 animate-pulse">
                <div className="h-6 w-1/2 bg-gray-300 dark:bg-gray-600 rounded mb-4"></div>
                <div className="space-y-2">
                  {[...Array(5)].map((_, index) => (
                    <div key={index} className="h-4 w-full bg-gray-300 dark:bg-gray-600 rounded"></div>
                  ))}
                </div>
              </div>
              <div className="space-y-4">
                <div className="h-10 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                <div className="h-10 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Loading;