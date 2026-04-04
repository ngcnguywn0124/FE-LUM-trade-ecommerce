'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, RotateCw, ZoomIn, ZoomOut, Move } from 'lucide-react';

interface ImageCropModalProps {
  imageSrc: string;
  isOpen: boolean;
  onClose: () => void;
  onCrop: (croppedBlob: Blob) => void;
}

const ImageCropModal: React.FC<ImageCropModalProps> = ({
  imageSrc,
  isOpen,
  onClose,
  onCrop,
}) => {
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (isOpen) {
      setZoom(1);
      setOffset({ x: 0, y: 0 });
    }
  }, [isOpen, imageSrc]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - offset.x, y: e.clientY - offset.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setOffset({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleZoom = (delta: number) => {
    setZoom(prev => Math.max(0.5, Math.min(3, prev + delta)));
  };

  const executeCrop = () => {
    if (!imageRef.current || !containerRef.current) return;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // We want a 16:9 output
    const targetWidth = 1280;
    const targetHeight = 720;
    canvas.width = targetWidth;
    canvas.height = targetHeight;

    const img = imageRef.current;
    const container = containerRef.current;
    
    const containerRect = container.getBoundingClientRect();
    const imageRect = img.getBoundingClientRect();

    // Calculate scaling factor between screen view and real image
    const scaleX = img.naturalWidth / imageRect.width;
    const scaleY = img.naturalHeight / imageRect.height;

    // Source coordinates on the actual image
    const sX = (containerRect.left - imageRect.left) * scaleX;
    const sY = (containerRect.top - imageRect.top) * scaleY;
    const sW = containerRect.width * scaleX;
    const sH = containerRect.height * scaleY;

    ctx.drawImage(img, sX, sY, sW, sH, 0, 0, targetWidth, targetHeight);

    canvas.toBlob((blob) => {
      if (blob) onCrop(blob);
    }, 'image/jpeg', 0.9);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6 shadow-2xl">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-gray-900/80 backdrop-blur-md"
            onClick={onClose}
          />

          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="relative w-full max-w-3xl bg-white rounded-[2.5rem] overflow-hidden flex flex-col font-inter"
          >
            {/* Header */}
            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center text-white shadow-lg">
                  <RotateCw size={20} />
                </div>
                <div>
                  <h3 className="text-xl font-black text-gray-900 leading-none mb-1">Căn chỉnh góc ảnh</h3>
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Kéo để di chuyển & phóng to</p>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-900 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Cropping Area */}
            <div className="flex-1 p-8 bg-gray-50 flex items-center justify-center min-h-[400px]">
               <div 
                  ref={containerRef}
                  className="relative w-full aspect-[16/9] bg-gray-200 rounded-2xl overflow-hidden shadow-inner border border-gray-100"
                  style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseUp}
               >
                  <img 
                     ref={imageRef}
                     src={imageSrc}
                     alt="To crop"
                     className="absolute pointer-events-none select-none max-w-none"
                     style={{
                        transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoom})`,
                        transition: isDragging ? 'none' : 'transform 0.1s ease-out'
                     }}
                     draggable={false}
                  />
                  
                  {/* Grid overlay */}
                  <div className="absolute inset-0 pointer-events-none grid grid-cols-3 grid-rows-3 opacity-20">
                     {[...Array(9)].map((_, i) => (
                        <div key={i} className="border border-white" />
                     ))}
                  </div>

                  {/* Move Helper */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-0 hover:opacity-100 transition-opacity">
                      <div className="p-4 bg-black/20 backdrop-blur-sm rounded-full text-white">
                         <Move size={32} />
                      </div>
                  </div>
               </div>
            </div>

            {/* Controls */}
            <div className="p-6 border-t border-gray-100 bg-white space-y-6">
               <div className="flex items-center gap-6">
                  <ZoomOut size={18} className="text-gray-400" />
                  <input 
                     type="range"
                     min="0.5"
                     max="3"
                     step="0.01"
                     value={zoom}
                     onChange={(e) => setZoom(parseFloat(e.target.value))}
                     className="flex-1 h-1.5 bg-gray-100 rounded-full appearance-none accent-emerald-500 cursor-pointer"
                  />
                  <ZoomIn size={18} className="text-gray-400" />
                  <span className="min-w-[40px] text-xs font-black text-gray-900 text-center">{Math.round(zoom * 100)}%</span>
               </div>

               <div className="flex items-center justify-between gap-4">
                  <p className="text-xs text-gray-500 font-medium italic">
                    * Ảnh sẽ được cắt theo khung 16:9 để hiển thị tốt nhất trên Blog.
                  </p>
                  <div className="flex items-center gap-3">
                     <button 
                        onClick={onClose}
                        className="px-6 py-2.5 bg-gray-50 text-gray-500 font-bold rounded-xl hover:bg-gray-100 transition-all border border-gray-100"
                     >
                        Hủy bỏ
                     </button>
                     <button 
                        onClick={executeCrop}
                        className="px-8 py-2.5 bg-emerald-500 text-white font-black rounded-xl hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-100 flex items-center gap-2"
                     >
                        <Check size={18} />
                        Áp dụng
                     </button>
                  </div>
               </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ImageCropModal;
