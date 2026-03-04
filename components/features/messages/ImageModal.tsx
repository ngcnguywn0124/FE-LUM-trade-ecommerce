'use client';

import { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Download, ZoomIn, ZoomOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ImageModalProps {
  images: string[];
  initialIndex: number;
  isOpen: boolean;
  onClose: () => void;
}

const ImageModal = ({ images, initialIndex, isOpen, onClose }: ImageModalProps) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [zoomScale, setZoomScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    setCurrentIndex(initialIndex);
    setZoomScale(1);
    setPosition({ x: 0, y: 0 });
  }, [initialIndex, isOpen]);

  const handleZoomIn = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setZoomScale(prev => Math.min(prev + 0.5, 4));
  };

  const handleZoomOut = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setZoomScale(prev => {
      const newScale = Math.max(prev - 0.5, 1);
      if (newScale === 1) setPosition({ x: 0, y: 0 });
      return newScale;
    });
  };

  const resetZoom = () => {
    setZoomScale(1);
    setPosition({ x: 0, y: 0 });
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft' && zoomScale === 1) handlePrev();
      if (e.key === 'ArrowRight' && zoomScale === 1) handleNext();
      if (e.key === '+' || e.key === '=') handleZoomIn();
      if (e.key === '-') handleZoomOut();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, zoomScale]);

  const handlePrev = () => {
    resetZoom();
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
  };

  const handleNext = () => {
    resetZoom();
    setCurrentIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoomScale > 1) {
      setIsDragging(true);
      e.preventDefault();
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && zoomScale > 1) {
      setPosition(prev => ({
        x: prev.x + e.movementX,
        y: prev.y + e.movementY
      }));
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex flex-col bg-black/95 backdrop-blur-sm pt-[72px] select-none"
        onClick={onClose}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {/* Header toolbar within modal */}
        <div className="flex items-center justify-between p-4 text-white z-10 bg-black/40">
          <div className="text-sm font-medium">
            {currentIndex + 1} / {images.length} 
            {zoomScale > 1 && <span className="ml-2 text-emerald-400">({Math.round(zoomScale * 100)}%)</span>}
          </div>
          <div className="flex items-center gap-2 md:gap-4">
            <button 
               onClick={handleZoomOut}
               disabled={zoomScale <= 1}
               className="p-2 hover:bg-white/10 rounded-full transition-colors disabled:opacity-30"
               title="Thu nhỏ"
            >
              <ZoomOut size={20} />
            </button>
            <button 
               onClick={handleZoomIn}
               disabled={zoomScale >= 4}
               className="p-2 hover:bg-white/10 rounded-full transition-colors disabled:opacity-30"
               title="Phóng to"
            >
              <ZoomIn size={20} />
            </button>
            <div className="w-px h-6 bg-white/20 mx-1" />
            <button 
               onClick={(e) => {
                 e.stopPropagation();
                 const link = document.createElement('a');
                 link.href = images[currentIndex];
                 link.download = `image-${currentIndex + 1}.jpg`;
                 link.click();
               }}
               className="p-2 hover:bg-white/10 rounded-full transition-colors"
               title="Tải xuống"
            >
              <Download size={20} />
            </button>
            <button 
              onClick={(e) => { e.stopPropagation(); onClose(); }}
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
              title="Đóng"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Main photo area */}
        <div className="flex-1 relative flex items-center justify-center overflow-hidden">
          {zoomScale === 1 && (
            <>
              <button
                className="absolute left-4 z-10 p-3 bg-black/20 hover:bg-black/40 text-white rounded-full transition-all border border-white/10"
                onClick={(e) => { e.stopPropagation(); handlePrev(); }}
              >
                <ChevronLeft size={32} />
              </button>
              <button
                className="absolute right-4 z-10 p-3 bg-black/20 hover:bg-black/40 text-white rounded-full transition-all border border-white/10"
                onClick={(e) => { e.stopPropagation(); handleNext(); }}
              >
                <ChevronRight size={32} />
              </button>
            </>
          )}

          <div
            className={`w-full h-full flex items-center justify-center p-4 md:p-8 ${zoomScale > 1 ? 'cursor-grab active:cursor-grabbing' : ''}`}
            onClick={(e) => e.stopPropagation()}
            onMouseDown={handleMouseDown}
          >
            <motion.img
              key={currentIndex}
              src={images[currentIndex]}
              alt={`Image ${currentIndex + 1}`}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ 
                opacity: 1, 
                scale: zoomScale,
                x: position.x,
                y: position.y
              }}
              exit={{ opacity: 0 }}
              transition={{ 
                scale: { type: 'spring', damping: 25, stiffness: 200 },
                opacity: { duration: 0.2 },
                x: { duration: 0 },
                y: { duration: 0 }
              }}
              onDoubleClick={(e) => zoomScale > 1 ? resetZoom() : handleZoomIn(e)}
              className="max-w-full max-h-full object-contain shadow-2xl rounded-sm touch-none"
              style={{ cursor: zoomScale > 1 ? 'inherit' : 'zoom-in' }}
            />
          </div>
        </div>

        {/* Thumbnails strip */}
        <div 
          className="p-4 md:p-6 flex justify-center gap-2 overflow-x-auto no-scrollbar bg-black/40 border-t border-white/5"
          onClick={(e) => e.stopPropagation()}
        >
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => { resetZoom(); setCurrentIndex(idx); }}
              className={`relative shrink-0 w-12 h-12 md:w-16 md:h-16 rounded-md overflow-hidden transition-all ${
                idx === currentIndex ? 'ring-2 ring-emerald-500 scale-110 opacity-100' : 'opacity-40 hover:opacity-100'
              }`}
            >
              <img src={img} className="w-full h-full object-cover" alt="" />
            </button>
          ))}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ImageModal;
