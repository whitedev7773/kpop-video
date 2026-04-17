export {};
declare global {
  const JSZip: any;
  interface Window {
    audioState: any;
    videoState: any;
    lyricsState: any;
    uiState: any;
    applyMusic?: (file: any) => void;
    applyVideo?: (file: any) => void;
    applyLyrics?: (text: any, mode?: any) => void;
    removeMusic?: () => void;
    formatTime: (time: number) => string;
    detectLyricsMode: (text: string) => string;
    showToast: (message: string) => void;
    showLoading: (message: string) => void;
    updateLoading: (message: string, progress: number) => void;
    hideLoading: () => void;
    KPOPModules: any;
    animationFrameId: number;
    openMusicInput?: () => void;
    openVideoInput?: () => void;
  }
}
