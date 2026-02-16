import React from "react";

const PageLoader = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
        <p className="text-lg font-semibold tracking-wide text-gray-700">
          Please wait...
        </p>
      </div>
    </div>
  );
};

export default PageLoader;
