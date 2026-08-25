import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

const buildTearPoints = () => {
  const points = [[50, 0]];
  for (let i = 1; i < 12; i += 1) {
    points.push([50 + (Math.random() - 0.5) * 6, (i / 12) * 100]);
  }
  points.push([50, 100]);
  return points;
};

const Preloader = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);
  const leftRef = useRef(null);
  const rightRef = useRef(null);
  const containerRef = useRef(null);
  const exitStarted = useRef(false);

  useEffect(() => {
    const points = buildTearPoints();
    const startedAt = performance.now();
    let raf = 0;

    const tick = () => {
      const elapsed = performance.now() - startedAt;
      const value = Math.min(100, Math.round((elapsed / 1800) * 100));
      setProgress(value);

      // The loader must never depend on a 3D asset, WebGL event, or
      // scene-ready callback. The scene can continue loading underneath it.
      if (!exitStarted.current && elapsed >= 1800) {
        exitStarted.current = true;
        const tl = gsap.timeline({
          onComplete: () => {
            setDone(true);
            onComplete?.();
          },
        });

        tl.to({}, { duration: 0.15 });
        tl.to(leftRef.current, {
          xPercent: -100,
          rotation: -2,
          duration: 1.15,
          ease: 'power3.inOut',
        }, 'tear');
        tl.to(rightRef.current, {
          xPercent: 100,
          rotation: 2,
          duration: 1.15,
          ease: 'power3.inOut',
        }, 'tear');
        tl.to(containerRef.current, {
          opacity: 0,
          duration: 0.25,
        }, '-=0.25');
        return;
      }

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [onComplete]);

  if (done) return null;

  const tearPath = pointsToPath(points);
  const tearPoints = pointsToPathPoints(tearPath);
  const leftClip = pointsToClip(tearPoints, 'left');
  const rightClip = pointsToClip(tearPoints, 'right');

  return (
    <div className="preloader" ref={containerRef}>
      <div className="preloader__half preloader__half--left" ref={leftRef} style={{ clipPath: leftClip }}>
        <div className="preloader__percentage">{progress}%</div>
      </div>
      <div className="preloader__half preloader__half--right" ref={rightRef} style={{ clipPath: rightClip }}>
        <div className="preloader__percentage">{progress}%</div>
      </div>
    </div>
  );
};

function pointsToPath(points) {
  return points.map(([x, y], i) => `${i === 0 ? 'M' : 'L'} ${x} ${y}`).join(' ');
}

function pointsToPathPoints(path) {
  return path
    .replace(/[ML]/g, '')
    .trim()
    .split(/\s+/)
    .reduce((acc, value, index, values) => {
      if (index % 2 === 0 && values[index + 1] !== undefined) {
        acc.push([Number(value), Number(values[index + 1])]);
      }
      return acc;
    }, []);
}

function pointsToClip(points, side) {
  if (!points.length) {
    return side === 'left'
      ? 'polygon(0 0, 0 100%, 50% 100%, 50% 0)'
      : 'polygon(50% 0, 50% 100%, 100% 100%, 100% 0)';
  }

  const edge = points.map(([x, y]) => `${x}% ${y}%`).join(', ');
  if (side === 'left') return `polygon(0% 0%, ${edge}, 0% 100%)`;
  return `polygon(100% 0%, 100% 100%, ${[...points].reverse().map(([x, y]) => `${x}% ${y}%`).join(', ')})`;
}

export default Preloader;
