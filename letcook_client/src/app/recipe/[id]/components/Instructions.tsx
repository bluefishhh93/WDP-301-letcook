import React, { useState } from 'react';
import { Step } from 'CustomTypes';
import { ChefHat, X } from 'lucide-react';

interface InstructionsProps {
  steps: Step[];
}

interface ImageOverlayProps {
  src: string;
  alt: string;
  onClose: () => void;
}

const ImageOverlay: React.FC<ImageOverlayProps> = ({ src, alt, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center">
      <div className="relative max-w-4xl max-h-full">
        <img src={src} alt={alt} className="max-w-full max-h-[90vh] object-contain" />
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white hover:text-gray-300"
        >
          <X size={24} />
        </button>
      </div>
    </div>
  );
};

const Instructions: React.FC<InstructionsProps> = ({ steps }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const openImageOverlay = (imageSrc: string) => {
    setSelectedImage(imageSrc);
  };

  const closeImageOverlay = () => {
    setSelectedImage(null);
  };

  return (
    <div>
      <div className='flex gap-4'>
        <ChefHat className="w-8 h-8 text-green-500" />
        <h2 className="text-2xl font-bold mb-6">Instructions</h2>
      </div>
      <div className="space-y-8">
        {steps.map((step, index) => (
          <div key={step._id} className="flex flex-col gap-3">
            <div className="flex flex-col gap-4">
              <div className='flex items-center gap-4'>
                <h3 className="w-6 h-6 flex items-center justify-center text-white bg-slate-400 rounded-full font-semibold">
                  {index + 1}
                </h3>
                <p className="text-lg">{step.description}</p>
              </div>

              <div className="flex flex-wrap gap-4">
                {step.images.map((image, imgIndex) => (
                  <img
                    key={imgIndex}
                    src={image}
                    alt={`Step ${index + 1} - Image ${imgIndex + 1}`}
                    className="w-full md:w-1/4 h-48 object-cover rounded-lg shadow-md transition-transform hover:scale-105 cursor-pointer"
                    onClick={() => openImageOverlay(image)}
                  />
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
      {selectedImage && (
        <ImageOverlay
          src={selectedImage}
          alt="Zoomed Image"
          onClose={closeImageOverlay}
        />
      )}
    </div>
  );
};

export default Instructions;