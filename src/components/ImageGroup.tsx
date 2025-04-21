
import React from "react";
import { ImageFile } from "./ImageUploader";
import { Card } from "@/components/ui/card";

type Props = {
  groupLabel: string;
  images: ImageFile[];
};

const ImageGroup: React.FC<Props> = ({ groupLabel, images }) => {
  return (
    <Card className="p-4 flex-1 min-w-[220px] max-w-full">
      <h2 className="font-semibold text-lg mb-3 text-violet-600">{groupLabel}</h2>
      {images.length === 0 ? (
        <div className="text-gray-400 text-center py-4">No images</div>
      ) : (
        <div className="flex flex-wrap gap-3 justify-center">
          {images.map((img, i) => (
            <div key={i} className="w-24 h-24 rounded overflow-hidden border bg-white/90 shadow-sm transition-transform duration-200 hover:scale-105">
              <img src={img.url} alt={img.file.name} className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};

export default ImageGroup;
