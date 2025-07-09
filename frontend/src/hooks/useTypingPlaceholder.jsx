// hooks/useTypingPlaceholder.js
import { useEffect } from "react";

export default function useTypingPlaceholder(ref, fullText = "", delay = 60) {
  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      if (ref.current) {
        ref.current.placeholder = fullText.slice(0, i) + "|";
        i++;
        if (i > fullText.length) {
          clearInterval(interval);
          ref.current.placeholder = fullText; // remove cursor
        }
      }
    }, delay);

    return () => clearInterval(interval);
  }, [ref, fullText, delay]);
}
