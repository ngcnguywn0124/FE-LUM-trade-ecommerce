import { Camera, Trash2, Info } from 'lucide-react';
import Image from 'next/image';
import PostItemSection from './PostItemSection';

interface PostItemImagePickerProps {
  imagePreviews: string[];
  error?: string;
  onAddImages: (files: FileList | null) => void;
  onRemoveImage: (index: number) => void;
  onSetPrimary?: (index: number) => void;
}

const PostItemImagePicker = ({ 
  imagePreviews, 
  error, 
  onAddImages, 
  onRemoveImage,
  onSetPrimary 
}: PostItemImagePickerProps) => {
  return (
    <PostItemSection
      title="Hình ảnh sản phẩm"
      description="Ảnh rõ nét, đủ góc chụp sẽ giúp tăng tỷ lệ chốt đơn"
    >
      <div className="space-y-4">
        <label className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-gray-300 bg-gray-50 px-4 py-8 text-center cursor-pointer hover:border-emerald-400 hover:bg-emerald-50/40 transition-all">
          <div className="h-12 w-12 rounded-full bg-white border border-gray-200 flex items-center justify-center text-emerald-600 shadow-sm">
            <Camera size={20} />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-800">Chọn ảnh từ thiết bị</p>
            <p className="text-xs text-gray-500 mt-1 font-medium">Tối đa 8 ảnh, định dạng JPG/PNG/WebP</p>
          </div>
          <input
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(event) => {
              onAddImages(event.target.files);
              event.target.value = '';
            }}
          />
        </label>

        {error ? <p className="text-xs text-red-500 font-medium flex items-center gap-1">
          <Info size={14} />
          {error}
        </p> : null}

        {imagePreviews.length > 0 ? (
          <div className="grid grid-cols-4 gap-2 sm:gap-3 pt-2">
            {imagePreviews.map((image, index) => (
              <div 
                key={`${image}-${index}`} 
                className={`relative rounded-lg overflow-hidden border shadow-sm group aspect-square cursor-pointer transition-all ${
                  index === 0 ? 'border-emerald-500 ring-2 ring-emerald-500/20' : 'border-gray-100 hover:border-emerald-300'
                }`}
                onClick={() => onSetPrimary?.(index)}
              >
                <Image
                  src={image}
                  alt={`Ảnh sản phẩm ${index + 1}`}
                  fill
                  unoptimized
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveImage(index);
                  }}
                  className="absolute top-1.5 right-1.5 h-6 w-6 rounded-lg bg-black/50 text-white flex items-center justify-center hover:bg-red-500 transition-colors cursor-pointer backdrop-blur-sm z-10"
                >
                  <Trash2 size={12} />
                </button>
                {index === 0 ? (
                  <span className="absolute left-1.5 bottom-1.5 rounded bg-emerald-600 px-2 py-0.5 text-[10px] font-bold text-white shadow-sm uppercase tracking-wider z-10">
                    Ảnh bìa
                  </span>
                ) : (
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <span className="bg-white/90 text-gray-800 text-[10px] font-bold px-2 py-1 rounded shadow-sm">
                      Đặt làm ảnh bìa?
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </PostItemSection>
  );
};

export default PostItemImagePicker;
