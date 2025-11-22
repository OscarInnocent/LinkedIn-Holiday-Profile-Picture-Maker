import React, { useState, useRef } from 'react';
import { EditorState, Theme } from './types';
import { THEMES } from './constants';
import { CanvasEditor } from './components/CanvasEditor';
import { Button } from './components/Button';
import { GeminiModal } from './components/GeminiModal';

const EMOJIS = ['🎅', '🎄', '❄️', '🎁', '🦃', '🍂', '🥧', '💼', '🚀', '✨', '👋', '⭐'];

const App: React.FC = () => {
  const [state, setState] = useState<EditorState>({
    image: null,
    zoom: 1,
    pan: { x: 0, y: 0 },
    themeId: THEMES[0].id,
    customText: '',
    customColor: '',
    textSize: 32,
    showRadialBackground: false,
  });

  const [isGeminiOpen, setIsGeminiOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const activeTheme = THEMES.find(t => t.id === state.themeId) || THEMES[0];

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          setState(prev => ({ ...prev, image: img, zoom: 1, pan: { x: 0, y: 0 } }));
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDownload = () => {
    const canvas = document.getElementById('main-canvas') as HTMLCanvasElement;
    if (canvas) {
      const link = document.createElement('a');
      link.download = `linkedin-profile-${state.themeId}.png`;
      link.href = canvas.toDataURL('image/png', 1.0);
      link.click();
    }
  };

  const addEmoji = (emoji: string) => {
    setState(s => ({ ...s, customText: s.customText + emoji }));
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🎄</span>
            <div>
              <h1 className="text-xl font-bold text-gray-900 leading-tight">LinkedIn Holiday Profile Picture Maker</h1>
              <p className="text-xs text-gray-500">Professional & Festive Profile Frames</p>
            </div>
          </div>
          <div className="text-sm text-gray-400 hidden sm:block">Not affiliated with LinkedIn</div>
        </div>
      </header>

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Preview */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-800">Preview</h2>
              </div>
              
              <CanvasEditor state={state} onDownload={() => {}} />
              
              {/* Image Controls */}
              {state.image && (
                <div className="mt-6 flex flex-wrap gap-4 items-center justify-between border-t border-gray-100 pt-4">
                   <div className="flex gap-4 items-center">
                      <label className="text-sm font-medium text-gray-700">Zoom</label>
                      <input 
                        type="range" 
                        min="0.5" 
                        max="3" 
                        step="0.1" 
                        value={state.zoom}
                        onChange={(e) => setState(s => ({ ...s, zoom: parseFloat(e.target.value) }))}
                        className="w-32 accent-blue-600"
                      />
                   </div>
                   <div className="flex gap-2">
                     <Button variant="secondary" onClick={() => fileInputRef.current?.click()}>Change Photo</Button>
                     <Button 
                        variant="primary" 
                        onClick={() => setIsGeminiOpen(true)}
                        className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 border-none text-white shadow-lg"
                      >
                       ✨ AI Magic Edit
                     </Button>
                   </div>
                </div>
              )}

              {!state.image && (
                <div className="mt-6 flex justify-center">
                   <input 
                      type="file" 
                      accept="image/png, image/jpeg" 
                      ref={fileInputRef}
                      className="hidden"
                      onChange={handleImageUpload}
                   />
                   <Button onClick={() => fileInputRef.current?.click()} className="w-full sm:w-auto text-lg py-3">
                     Upload Profile Photo
                   </Button>
                </div>
              )}
            </div>

            {/* Footer Message */}
            <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 text-gray-700">
               <p className="mb-2">Thank you for using this tool. No one likes boring, and boring isn't fun. So I thought to add a twist to LinkedIn profile pictures.</p>
               <p className="mb-2">I appreciate your support and would love to hear your experience. If you like this, take a moment to leave a <a href="https://docs.google.com/forms/d/e/1FAIpQLSf1wbg7FuDxIMd5JpeEsY1pAspOcTyD0_3Gp-maZkM7YiZIbQ/viewform?usp=sharing&ouid=111521219457272653574" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline font-medium">review</a> so I can continue improving the product.</p>
               <p>If you would like to stay connected or follow the journey, feel free to connect with me on <a href="https://www.linkedin.com/in/oscarinnocent/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline font-medium">LinkedIn</a> as well : )</p>
            </div>

          </div>

          {/* Right Column: Controls */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-24">
              <h2 className="text-lg font-semibold text-gray-800 mb-6">Customization</h2>
              
              <div className="space-y-6">
                
                {/* Themes */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Select Theme</label>
                  <div className="space-y-2 max-h-60 overflow-y-auto pr-1 custom-scrollbar">
                    {['Work', 'Thanksgiving', 'Christmas'].map(category => (
                      <div key={category}>
                        <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 mt-2">{category}</div>
                        <div className="grid grid-cols-1 gap-2">
                          {THEMES.filter(t => t.category === category).map(theme => (
                            <button
                              key={theme.id}
                              onClick={() => setState(s => ({ ...s, themeId: theme.id, customColor: '', customText: '' }))}
                              className={`flex items-center p-2 rounded-lg border transition-all w-full text-left ${state.themeId === theme.id ? 'border-blue-500 ring-1 ring-blue-500 bg-blue-50' : 'border-gray-200 hover:bg-gray-50'}`}
                            >
                              <div 
                                className="w-6 h-6 rounded-full mr-3 flex-shrink-0" 
                                style={{ backgroundColor: theme.primaryColor }} 
                              />
                              <span className="text-sm font-medium text-gray-700">{theme.name} {theme.icon}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Text Customization */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Ring Text</label>
                  <input 
                    type="text" 
                    value={state.customText}
                    placeholder={activeTheme.defaultText}
                    onChange={(e) => setState(s => ({ ...s, customText: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  {/* Emoji Picker */}
                  <div className="mt-2">
                    <label className="block text-xs font-medium text-gray-500 mb-1">Add Emoji</label>
                    <div className="flex flex-wrap gap-2">
                      {EMOJIS.map(emoji => (
                        <button 
                          key={emoji}
                          onClick={() => addEmoji(emoji)}
                          className="text-xl hover:bg-gray-100 rounded p-1 transition-colors"
                          title="Add emoji"
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Text Size */}
                <div>
                   <div className="flex justify-between items-center mb-2">
                     <label className="block text-sm font-medium text-gray-700">Text Size</label>
                     <span className="text-xs text-gray-500">{state.textSize}px</span>
                   </div>
                   <input 
                      type="range" 
                      min="20" 
                      max="60" 
                      step="1"
                      value={state.textSize}
                      onChange={(e) => setState(s => ({ ...s, textSize: parseInt(e.target.value) }))}
                      className="w-full accent-blue-600"
                   />
                </div>

                {/* Color Customization */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Ring Color</label>
                  <div className="flex items-center gap-3">
                    <input 
                      type="color" 
                      value={state.customColor || activeTheme.primaryColor}
                      onChange={(e) => setState(s => ({ ...s, customColor: e.target.value }))}
                      className="h-10 w-14 rounded cursor-pointer border-0 p-0"
                    />
                    <span className="text-sm text-gray-500">Click to override theme color</span>
                  </div>
                </div>

                {/* Toggles */}
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Radial Background</span>
                  <button 
                    onClick={() => setState(s => ({ ...s, showRadialBackground: !s.showRadialBackground }))}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${state.showRadialBackground ? 'bg-blue-600' : 'bg-gray-200'}`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition duration-200 ease-in-out ${state.showRadialBackground ? 'translate-x-6' : 'translate-x-1'}`} />
                  </button>
                </div>

                {/* Download */}
                <div className="pt-6 border-t border-gray-100">
                  <Button 
                    onClick={handleDownload} 
                    className="w-full text-lg py-3 shadow-lg shadow-blue-200"
                    disabled={!state.image}
                  >
                    Download Profile Image
                  </Button>
                </div>

              </div>
            </div>
          </div>
        </div>
      </main>
      
      {/* AI Modal */}
      <GeminiModal 
        isOpen={isGeminiOpen}
        onClose={() => setIsGeminiOpen(false)}
        currentImage={state.image}
        onImageUpdate={(newImg) => setState(s => ({ ...s, image: newImg }))}
      />

    </div>
  );
};

export default App;