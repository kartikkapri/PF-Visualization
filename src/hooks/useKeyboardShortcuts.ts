import { useEffect } from 'react';
import { useAppState } from './useApp';
import { useGridActions } from './useGrid';

interface UseKeyboardShortcutsProps {
  onRunAlgorithm: () => void;
  onCancelAnimation: () => void;
}

export const useKeyboardShortcuts = ({
  onRunAlgorithm,
  onCancelAnimation,
}: UseKeyboardShortcutsProps) => {
  const { isAnimating } = useAppState();
  const { resetGrid, clearPath, clearWalls } = useGridActions();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Ignore if user is typing in an input
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
        return;
      }

      switch (event.key.toLowerCase()) {
        case ' ': // Space - Run/Stop algorithm
          event.preventDefault();
          if (isAnimating) {
            onCancelAnimation();
          } else {
            onRunAlgorithm();
          }
          break;
        case 'r': // R - Reset grid
          event.preventDefault();
          if (!isAnimating) {
            resetGrid();
          }
          break;
        case 'c': // C - Clear path
          event.preventDefault();
          if (!isAnimating) {
            clearPath();
          }
          break;
        case 'w': // W - Clear walls
          event.preventDefault();
          if (!isAnimating) {
            clearWalls();
          }
          break;
        case 'escape': // Escape - Stop animation
          event.preventDefault();
          if (isAnimating) {
            onCancelAnimation();
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAnimating, onRunAlgorithm, onCancelAnimation, resetGrid, clearPath, clearWalls]);
};