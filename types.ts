export interface Theme {
  id: string;
  name: string;
  category: 'Work' | 'Thanksgiving' | 'Christmas';
  primaryColor: string;
  secondaryColor: string;
  defaultText: string;
  icon?: string; // Emoji or simple char
}

export interface EditorState {
  image: HTMLImageElement | null;
  zoom: number;
  pan: { x: number; y: number };
  themeId: string;
  customText: string;
  customColor: string;
  textSize: number;
  showRadialBackground: boolean;
}