import React, { useEffect, useRef } from 'react';
import { EditorState } from '../types';
import { CANVAS_SIZE_PROFILE, THEMES } from '../constants';

interface CanvasEditorProps {
  state: EditorState;
  onDownload: (dataUrl: string) => void;
}

// Helper to draw text along an arc
const drawCurvedText = (
  ctx: CanvasRenderingContext2D,
  text: string,
  radius: number,
  centerX: number,
  centerY: number,
  startAngle: number,
  color: string,
  fontSize: number
) => {
  ctx.save();
  // Include emoji-compatible fonts
  ctx.font = `bold ${fontSize}px Inter, "Segoe UI Emoji", "Apple Color Emoji", "Noto Color Emoji", sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = color;

  // Use Array.from to correctly split emojis (surrogate pairs)
  const characters = Array.from(text);
  
  // Calculate widths for accurate spacing
  const charWidths = characters.map(char => ctx.measureText(char).width);

  // Start writing from startAngle
  // We move anti-clockwise (decreasing angle)
  let currentAngle = startAngle;

  for (let i = 0; i < characters.length; i++) {
    const char = characters[i];
    const charWidth = charWidths[i];
    
    // Calculate angular width of the character
    const charAngle = charWidth / radius;
    
    // Center the character within its angular slot
    // We subtract half the angle because we are moving in decreasing angle direction
    // and we want currentAngle to represent the start (top/left-most point) of this character's slot
    const centerAngle = currentAngle - (charAngle / 2);

    ctx.save();
    ctx.translate(centerX, centerY);
    
    // Rotation logic:
    // We want the text top to point towards the center (or away? Standard is away for bottom text).
    // At Math.PI (Left), text is vertical. 
    // At PI/2 (Bottom), text is upright.
    // Formula: Rotation = Angle - PI/2 aligns text baseline to the tangent.
    ctx.rotate(centerAngle - Math.PI / 2);
    
    ctx.translate(0, radius);
    ctx.fillText(char, 0, 0);
    ctx.restore();

    // Move cursor for next character
    // Tighter spacing: just use the character width.
    currentAngle -= charAngle;
  }
  ctx.restore();
};

export const CanvasEditor: React.FC<CanvasEditorProps> = ({ state, onDownload }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const activeTheme = THEMES.find(t => t.id === state.themeId) || THEMES[0];
  const ringColor = state.customColor || activeTheme.primaryColor;
  
  // Logic for text content:
  // If custom text exists, use it as is.
  // If no custom text, use default text + theme icon.
  const isCustom = state.customText.trim().length > 0;
  const textContent = isCustom 
    ? state.customText 
    : (activeTheme.defaultText + (activeTheme.icon ? ` ${activeTheme.icon}` : ''));
  
  // Only uppercase default text, keep custom text casing? 
  // Usually these rings look best uppercase, but user might want lowercase.
  // Let's only force uppercase on default text.
  const ringText = isCustom ? textContent : textContent.toUpperCase();
  
  const fontSize = state.textSize || 32;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Handle DPI
    const dpr = window.devicePixelRatio || 1;
    
    const width = CANVAS_SIZE_PROFILE;
    const height = CANVAS_SIZE_PROFILE;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    
    // FIX: Set width style but DO NOT set height style.
    // This allows CSS (h-auto) to maintain aspect ratio when width is squeezed.
    canvas.style.width = `${width}px`;
    // canvas.style.height = `${height}px`; // Removed
    
    ctx.scale(dpr, dpr);

    // 1. Background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);

    // 1b. Radial Background (if enabled)
    if (state.showRadialBackground) {
      const grad = ctx.createRadialGradient(width / 2, height / 2, 10, width / 2, height / 2, width);
      grad.addColorStop(0, activeTheme.secondaryColor);
      grad.addColorStop(1, activeTheme.primaryColor);
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);
    }

    // 2. Avatar Setup
    const radius = 160; // Profile radius
    const centerX = width / 2;
    const centerY = height / 2;

    // 3. Draw Image (Clipped)
    ctx.save();
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();

    if (state.image) {
      // Apply Zoom & Pan
      const imgWidth = state.image.naturalWidth;
      const imgHeight = state.image.naturalHeight;
      
      // Basic "cover" fit logic adjusted by zoom
      const scale = Math.max((radius * 2) / imgWidth, (radius * 2) / imgHeight) * state.zoom;
      
      const drawW = imgWidth * scale;
      const drawH = imgHeight * scale;
      
      const x = centerX - (drawW / 2) + state.pan.x;
      const y = centerY - (drawH / 2) + state.pan.y;

      ctx.drawImage(state.image, x, y, drawW, drawH);
    } else {
      // Placeholder
      ctx.fillStyle = '#e5e7eb';
      ctx.fill();
    }
    ctx.restore();

    // 4. Draw Ring / Frame
    const lineWidth = 40; // Thickness of the colored band
    
    ctx.save();
    ctx.beginPath();
    
    // Arc Definition:
    // Start: 10 o'clock. (210 deg = 7PI/6)
    // End: 3 o'clock (0 deg).
    // Draw Counter-Clockwise (true) to go 210 -> 180 -> 90 -> 0.
    const startArc = (210 * Math.PI) / 180; 
    const endArc = 0;

    ctx.strokeStyle = ringColor;
    ctx.lineWidth = lineWidth;
    ctx.lineCap = 'round'; // Smoother ends for the segment
    ctx.arc(centerX, centerY, radius, startArc, endArc, true);
    ctx.stroke();
    ctx.restore();

    // 5. Draw Text
    if (ringText) {
        drawCurvedText(
            ctx, 
            ringText, 
            radius, 
            centerX, 
            centerY, 
            startArc, // Start at the top-left tip
            '#ffffff', 
            fontSize
        );
    }

  }, [state, activeTheme, ringColor, ringText, fontSize]);

  return (
    <div className="relative flex justify-center items-center bg-gray-100 border border-gray-200 rounded-xl overflow-hidden shadow-inner p-4 min-h-[320px] sm:min-h-[450px]">
      <canvas 
        id="main-canvas"
        ref={canvasRef} 
        className="max-w-full h-auto shadow-xl bg-white rounded-full"
      />
      {!state.image && (
        <div className="absolute pointer-events-none text-gray-400 font-medium">
           Canvas Preview
        </div>
      )}
    </div>
  );
};