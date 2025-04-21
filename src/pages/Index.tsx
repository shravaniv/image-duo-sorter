
import React, { useState } from "react";
import ImageUploader, { ImageFile } from "@/components/ImageUploader";
import ImageGroup from "@/components/ImageGroup";

const Index = () => {
  const [groups, setGroups] = useState<[ImageFile[], ImageFile[]] | null>(null);
  const [showGroups, setShowGroups] = useState(false);

  function handleSegregate(newGroups: [ImageFile[], ImageFile[]]) {
    setGroups(newGroups);
    setShowGroups(true);
  }

  function reset() {
    setGroups(null);
    setShowGroups(false);
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-tr from-[#D6BCFA] via-[#D3E4FD] to-[#F1F0FB]">
      <header className="pt-10 pb-6 text-center">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-violet-900 mb-3 tracking-tight drop-shadow">
          Parjinya Beta
        </h1>
        <p className="text-lg text-gray-700 max-w-lg mx-auto">
          Upload your images and let us segregate them into two groups with the press of a button!
        </p>
      </header>

      <main className="flex-1 flex flex-col items-center w-full px-2">
        {!showGroups && (
          <div className="max-w-xl w-full mx-auto">
            <ImageUploader onSegregate={handleSegregate} />
          </div>
        )}

        {showGroups && groups && (
          <div className="w-full flex flex-col items-center justify-center gap-8 mt-4">
            <div className="flex flex-col sm:flex-row gap-6 w-full max-w-3xl mx-auto transition-all duration-500">
              <ImageGroup groupLabel="Group 1" images={groups[0]} />
              <ImageGroup groupLabel="Group 2" images={groups[1]} />
            </div>
            <button
              onClick={reset}
              className="mt-4 px-5 py-2 rounded-lg bg-violet-500 text-white font-semibold hover:bg-violet-700 transition"
            >
              Upload Again
            </button>
          </div>
        )}
      </main>

      <footer className="w-full text-center my-8 text-sm text-gray-500">
        &copy; {new Date().getFullYear()} Parjinya Beta &mdash; by Lovable
      </footer>
    </div>
  );
};

export default Index;

