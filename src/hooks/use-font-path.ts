import { useEffect, useRef, useState, useCallback } from 'react';
import opentype from 'opentype.js';

// Google Fonts direct TTF URLs for each style
const FONT_URLS: Record<string, string> = {
  script: 'https://fonts.gstatic.com/s/dancingscript/v25/If2RXTr6YS-zF4S-kcSWSVi_szLgiuE.ttf',
  serif: 'https://fonts.gstatic.com/s/playfairdisplay/v37/nuFRD-vYSZviVYUb_rj3ij__anPXDTnCjmHKM4nYO7KN_qiTbtbK-F2rA0s.ttf',
  modern: 'https://fonts.gstatic.com/s/montserrat/v29/JTUHjIg1_i6t8kCHKm4532VJOt5-QNFgpCtr6Hw5aXo.ttf',
};

interface FontPathResult {
  pathData: string;
  width: number;
  ascender: number;
  descender: number;
  unitsPerEm: number;
  ready: boolean;
}

const fontCache = new Map<string, opentype.Font>();

export function useFontPath(
  text: string,
  fontId: string,
  fontSize: number
): FontPathResult {
  const [result, setResult] = useState<FontPathResult>({
    pathData: '',
    width: 0,
    ascender: 0,
    descender: 0,
    unitsPerEm: 1000,
    ready: false,
  });
  const loadingRef = useRef<string | null>(null);

  const generatePath = useCallback(
    (font: opentype.Font, str: string) => {
      if (!str.trim()) {
        setResult({
          pathData: '',
          width: 0,
          ascender: font.ascender,
          descender: font.descender,
          unitsPerEm: font.unitsPerEm,
          ready: true,
        });
        return;
      }
      const path = font.getPath(str, 0, 0, fontSize);
      const pathData = path.toPathData(2);
      const advanceWidth = font.getAdvanceWidth(str, fontSize);
      setResult({
        pathData,
        width: advanceWidth,
        ascender: font.ascender,
        descender: font.descender,
        unitsPerEm: font.unitsPerEm,
        ready: true,
      });
    },
    [fontSize]
  );

  useEffect(() => {
    const url = FONT_URLS[fontId];
    if (!url) return;

    // If font already cached, use immediately
    const cached = fontCache.get(fontId);
    if (cached) {
      generatePath(cached, text);
      return;
    }

    // Prevent duplicate fetches
    if (loadingRef.current === fontId) return;
    loadingRef.current = fontId;

    opentype.load(url, (err, font) => {
      loadingRef.current = null;
      if (err || !font) {
        console.error('Font load error:', err);
        return;
      }
      fontCache.set(fontId, font);
      generatePath(font, text);
    });
  }, [text, fontId, generatePath]);

  // Re-generate when text changes and font is already cached
  useEffect(() => {
    const cached = fontCache.get(fontId);
    if (cached) {
      generatePath(cached, text);
    }
  }, [text, fontId, generatePath]);

  return result;
}
