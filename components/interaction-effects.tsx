"use client";

import { useEffect, useRef, type ReactNode } from "react";

const colors = ["#f8c73e", "#d75e4e", "#527bac", "#72ad92", "#e89ab1"];

export function InteractionEffects({ children }: { children: ReactNode }) {
  const layer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function celebrate(event: MouseEvent) {
      if (
        !layer.current ||
        window.matchMedia("(prefers-reduced-motion: reduce)").matches
      )
        return;
      const rect = (event.target as Element).getBoundingClientRect();
      const x = event.detail === 0 ? rect.left + rect.width / 2 : event.clientX;
      const y = event.detail === 0 ? rect.top + rect.height / 2 : event.clientY;

      // Small local burst, independent of the action's success or completion.
      for (let index = 0; index < 18; index++) {
        const piece = document.createElement("span");
        const angle = (Math.PI * 2 * index) / 18;
        const distance = 38 + Math.random() * 48;
        const dx = Math.cos(angle) * distance;
        const dy = Math.sin(angle) * distance;
        Object.assign(piece.style, {
          position: "absolute",
          left: `${x}px`,
          top: `${y}px`,
          width: "6px",
          height: index % 3 === 0 ? "6px" : "3px",
          borderRadius: index % 3 === 0 ? "50%" : "1px",
          background: colors[index % colors.length],
        });
        layer.current.append(piece);
        const animation = piece.animate(
          [
            {
              transform: "translate(-50%, -50%) rotate(0deg) scale(0.4)",
              opacity: 1,
            },
            {
              transform: `translate(${dx * 0.75}px, ${dy * 0.75 - 16}px) rotate(${index * 23}deg) scale(1)`,
              opacity: 1,
              offset: 0.45,
            },
            {
              transform: `translate(${dx}px, ${dy + 38}px) rotate(${index * 47}deg) scale(0.5)`,
              opacity: 0,
            },
          ],
          {
            duration: 580 + (index % 4) * 45,
            easing: "cubic-bezier(0.16, 1, 0.3, 1)",
          },
        );
        animation.finished.then(
          () => piece.remove(),
          () => piece.remove(),
        );
      }
    }

    document.addEventListener("click", celebrate, true);
    return () => document.removeEventListener("click", celebrate, true);
  }, []);

  return (
    <div className="contents">
      {children}
      <div
        ref={layer}
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-[100] overflow-hidden"
      />
    </div>
  );
}
