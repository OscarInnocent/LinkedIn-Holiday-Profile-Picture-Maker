import React, { useState } from 'react';
import { Button } from './Button';
import { editImageWithGemini } from '../services/geminiService';

interface GeminiModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentImage: HTMLImageElement | null;
  onImageUpdate: (newImage: HTMLImageElement) => void;
}

export const GeminiModal: React.FC<GeminiModalProps> = ({ isOpen, onClose, currentImage, onImageUpdate }) => {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleGenerate = async () => {
    if (!currentImage || !prompt.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      // Convert current image to base64
      const canvas = document.createElement('canvas');
      canvas.width = currentImage.naturalWidth;
      canvas.height = currentImage.naturalHeight;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(currentImage, 0, 0);
      
      const dataUrl = canvas.toDataURL('image/png');
      const base64 = dataUrl.split(',')[1]; // Remove prefix

      const resultBase64 = await editImageWithGemini(base64, 'image/png', prompt);
      
      const newImg = new Image();
      newImg.onload = () => {
        onImageUpdate(newImg);
        setIsLoading(false);
        onClose();
        setPrompt('');
      };
      newImg.src = `data:image/png;base64,${resultBase64}`;

    } catch (err) {
      setError("Failed to generate image. Please try again.");
      console.error(err);
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              ✨ AI Magic Edit
            </h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="mb-6">
            <p className="text-sm text-gray-600 mb-3">
              Describe how you want to change your photo. E.g., "Add a Santa hat", "Make it look like a cartoon", or "Add a snowy background".
            </p>
            <textarea
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[100px]"
              placeholder="Enter your prompt..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          </div>

          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button 
              onClick={handleGenerate} 
              isLoading={isLoading}
              disabled={!prompt.trim()}
            >
              Generate
            </Button>
          </div>
        </div>
        <div className="bg-blue-50 px-6 py-3 text-xs text-blue-800 border-t border-blue-100">
          Powered by Gemini 2.5 Flash Image
        </div>
      </div>
    </div>
  );
};
