"use client";

import React, { useEffect, useState } from "react";

const InteractiveGrid: React.FC = () => {
  const [cells, setCells] = useState<JSX.Element[]>([]);

  useEffect(() => {
    const createCells = () => {
      const newCells: JSX.Element[] = [];
      const gridSize = parseInt(
        getComputedStyle(document.documentElement).getPropertyValue(
          "--grid-size"
        )
      );
      const rows = Math.ceil(window.innerHeight / gridSize);
      const cols = Math.ceil(window.innerWidth / gridSize);

      for (let i = 0; i < rows * cols; i++) {
        const row = Math.floor(i / cols);
        const col = i % cols;
        newCells.push(
          <div
            key={i}
            className="grid-cell"
            style={{
              top: `${row * gridSize}px`,
              left: `${col * gridSize}px`,
            }}
          />
        );
      }
      setCells(newCells);
    };

    createCells();
    window.addEventListener("resize", createCells);

    return () => {
      window.removeEventListener("resize", createCells);
    };
  }, []);

  return <div className="interactive-grid">{cells}</div>;
};

export default InteractiveGrid;
