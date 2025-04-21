
import React, { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload, Images } from "lucide-react";

type ImageFile = {
  file: File;
  url: string;
};

type Props = {
  onSegregate: (groups: [ImageFile[], ImageFile[]]) => void;
};

const LAMBDA_ENDPOINT = "https://your-lambda-api-endpoint.amazonaws.com/dev/segregate"; // TODO: replace with your Lambda endpoint

const ImageUploader: React.FC<Props> = ({ onSegregate }) => {
  const [images, setImages] = useState<ImageFile[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFiles(files: FileList | null) {
    if (!files) return;
    const imageFiles: ImageFile[] = [];
    for (const file of Array.from(files)) {
      if (file.type.startsWith("image/")) {
        imageFiles.push({ file, url: URL.createObjectURL(file) });
      }
    }
    setImages(imageFiles);
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragActive(false);
    handleFiles(e.dataTransfer.files);
  }

  function onInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    handleFiles(e.target.files);
  }

  function triggerInput() {
    inputRef.current?.click();
  }

  async function segregate() {
    if (images.length === 0) return;

    setLoading(true);

    try {
      const formData = new FormData();
      images.forEach((img, idx) => {
        formData.append("images", img.file, img.file.name);
      });

      const response = await fetch(LAMBDA_ENDPOINT, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Server error");
      }

      // The Lambda should return: { groups: [[filename, ...], [filename, ...]] }
      const data = await response.json();

      if (
        !data ||
        !Array.isArray(data.groups) ||
        data.groups.length !== 2
      ) {
        throw new Error("Unexpected Lambda response");
      }

      // Map group filenames to ImageFile objects
      const group1 = images.filter(img =>
        data.groups[0].includes(img.file.name)
      );
      const group2 = images.filter(img =>
        data.groups[1].includes(img.file.name)
      );
      onSegregate([group1, group2]);
    } catch (err) {
      // Fallback: locally random split if Lambda fails
      console.error("Lambda call failed, using fallback:", err);
      // Placeholder: Randomly assign to groups
      const shuffled = [...images].sort(() => 0.5 - Math.random());
      const mid = Math.ceil(shuffled.length / 2);
      const group1 = shuffled.slice(0, mid);
      const group2 = shuffled.slice(mid);
      onSegregate([group1, group2]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <div
        className={
          "flex flex-col items-center justify-center border-2 border-dashed rounded-lg transition-colors duration-200 p-6 cursor-pointer "
          + (dragActive ? "bg-blue-100 border-blue-400" : "bg-gray-50 border-gray-300")
        }
        tabIndex={0}
        onClick={triggerInput}
        onDragOver={e => { e.preventDefault(); setDragActive(true); }}
        onDragLeave={e => { e.preventDefault(); setDragActive(false); }}
        onDrop={onDrop}
        aria-label="Upload images"
      >
        <input
          ref={inputRef}
          type="file"
          multiple
          accept="image/*"
          className="hidden"
          onChange={onInputChange}
        />
        <Upload className="w-10 h-10 mb-2 text-blue-400" />
        <p className="font-semibold text-gray-700 mb-1">
          Drag & drop or <span className="underline">click to upload</span>
        </p>
        <p className="text-xs text-gray-500 mb-2">(Images only, select multiple allowed)</p>
        {images.length > 0 && (
          <div className="flex flex-wrap gap-2 justify-center mt-4 max-w-lg mx-auto bg-white/60 p-3 rounded-lg">
            {images.map((img, i) => (
              <img
                src={img.url}
                alt={img.file.name}
                key={i}
                className="w-16 h-16 object-cover rounded shadow border"
              />
            ))}
          </div>
        )}
      </div>
      <div className="flex flex-col items-center mt-5">
        <Button
          onClick={segregate}
          className="px-6"
          disabled={images.length === 0 || loading}
          aria-label="Segregate Images"
        >
          <Images className="w-4 h-4 mr-2" />
          {loading ? "Segregating..." : "Segregate Images"}
        </Button>
      </div>
    </div>
  );
};

export type { ImageFile };
export default ImageUploader;

