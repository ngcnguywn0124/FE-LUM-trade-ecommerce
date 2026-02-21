import { Camera, Trash2 } from 'lucide-react';
import Image from 'next/image';
import PostItemSection from './PostItemSection';

interface PostItemImagePickerProps {
  imagePreviews: string[];
  error?: string;
  onAddImages: (files: FileList | null) => void;
  onRemoveImage: (index: number) => void;
}

const PostItemImagePicker = ({ imagePreviews, error, onAddImages, onRemoveImage }: PostItemImagePickerProps) => {
  return (
    <PostItemSection
      title="Hình ảnh sản phẩm"
      description="Ảnh rõ nét, đủ góc chụp sẽ giúp tăng tỷ lệ chốt đơn"
    >
      <div className="space-y-4">
        <label className="flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 px-4 py-8 text-center cursor-pointer hover:border-emerald-400 hover:bg-emerald-50/40 transition-colors">
          <div className="h-12 w-12 rounded-full bg-white border border-gray-200 flex items-center justify-center text-emerald-600">
            <Camera size={20} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-800">Chọn ảnh từ thiết bị</p>
            <p className="text-xs text-gray-500 mt-1">Tối đa 8 ảnh, định dạng JPG/PNG/WebP</p>
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

        {error ? <p className="text-xs text-red-500">{error}</p> : null}

        {imagePreviews.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {imagePreviews.map((image, index) => (
              <div key={`${image}-${index}`} className="relative rounded-xl overflow-hidden border border-gray-200">
                <Image
                  src={image}
                  alt={`Ảnh sản phẩm ${index + 1}`}
                  width={320}
                  height={112}
                  unoptimized
                  className="h-28 w-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => onRemoveImage(index)}
                  className="absolute top-2 right-2 h-7 w-7 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80 transition-colors cursor-pointer"
                >
                  <Trash2 size={14} />
                </button>
                {index === 0 ? (
                  <span className="absolute left-2 bottom-2 rounded-md bg-emerald-600 px-2 py-1 text-[11px] font-medium text-white">
                    Ảnh bìa
                  </span>
                ) : null}
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </PostItemSection>
  );
};

export default PostItemImagePicker;
