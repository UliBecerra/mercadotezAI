import { useRef, useEffect, useState } from 'react';
import type { Business } from '../types';

interface Props {
    businesses: Business[];
}

export default function HoneycombView({ businesses }: Props) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [centerOffset, setCenterOffset] = useState({ x: 0, y: 0 });

    // Drag State
    const [panState, setPanState] = useState({ x: 0, y: 0, isDragging: false, startX: 0, startY: 0 });

    // HEX CONFIG - Larger Size
    const HEX_SIZE = 100; // Increased from 60
    const HEX_WIDTH = Math.sqrt(3) * HEX_SIZE;
    const HEX_HEIGHT = 2 * HEX_SIZE;
    // Spacing
    const GAP = 10;
    const X_STEP = (HEX_WIDTH + GAP);
    const Y_STEP = (HEX_HEIGHT + GAP) * 0.75;

    // Center viewport on mount/resize
    useEffect(() => {
        const updateCenter = () => {
            if (containerRef.current) {
                const { clientWidth, clientHeight } = containerRef.current;
                setCenterOffset({ x: clientWidth / 2, y: clientHeight / 2 });
            }
        };
        updateCenter();
        window.addEventListener('resize', updateCenter);
        return () => window.removeEventListener('resize', updateCenter);
    }, []);

    const handleMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
        const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
        const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;

        setPanState(prev => ({
            ...prev,
            isDragging: true,
            startX: clientX - prev.x,
            startY: clientY - prev.y
        }));
    };

    const handleMouseMove = (e: React.MouseEvent | React.TouchEvent) => {
        if (!panState.isDragging) return;

        const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
        const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;

        setPanState(prev => ({
            ...prev,
            x: clientX - prev.startX,
            y: clientY - prev.startY
        }));
    };

    const handleMouseUp = () => {
        setPanState(prev => ({ ...prev, isDragging: false }));
    };

    // Helper: Get Hex Coords (Axial q, r) for Index N in a Spiral
    // Sequence: 0=(0,0), then rings.
    const getSpiralCoords = (n: number) => {
        if (n === 0) return { q: 0, r: 0 };

        let radius = 1;
        let count = 0; // items in previous rings
        while (true) {
            const ringCount = 6 * radius;
            if (n <= count + ringCount) {
                // It's in this ring
                // Find position in ring
                let posInRing = n - count - 1;
                // Start at (0, -radius) in axial? Or specific corner.
                // Standard spiral walk: Start at q=0, r=-radius
                // Directions: 0:(1,0), 1:(1,1), 2:(0,1), -etc.
                // Let's use Cube coordinates for easier walking.
                // Start cube: x=0, y=-radius, z=radius? No, x+y+z=0.
                // Let's use: start at (-radius, 0, radius) ?

                // RedBlobGames Ring Walk:
                const cube_directions = [
                    { x: +1, y: -1, z: 0 }, { x: +1, y: 0, z: -1 }, { x: 0, y: +1, z: -1 },
                    { x: -1, y: +1, z: 0 }, { x: -1, y: 0, z: +1 }, { x: 0, y: -1, z: +1 }
                ];
                let x = cube_directions[4].x * radius;
                let z = cube_directions[4].z * radius;
                for (let i = 0; i < 6; i++) {
                    for (let j = 0; j < radius; j++) {
                        if (posInRing === 0) return { q: x, r: z };
                        x += cube_directions[i].x;
                        z += cube_directions[i].z;
                        posInRing--;
                    }
                }
                return { q: x, r: z };
            }
            count += ringCount;
            radius++;
        }
    };

    return (
        <div
            ref={containerRef}
            className="honeycomb-grid-container relative w-full overflow-hidden cursor-grab active:cursor-grabbing bg-neutral-100 dark:bg-slate-900"
            style={{
                height: '700px',
                perspective: '1000px' // Crucial for 3D effect
            }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleMouseDown}
            onTouchMove={handleMouseMove}
            onTouchEnd={handleMouseUp}
        >
            <style>{`
                .honeycomb-grid-container {
                    /* Light Mode Gradient */
                    background: radial-gradient(circle at center, #f1f5f9 0%, #cbd5e1 100%);
                }
                :global(.dark) .honeycomb-grid-container {
                    /* Dark Mode Gradient */
                    background: radial-gradient(circle at center, #0f172a 0%, #000 100%);
                }

                .honeycomb-item {
                    position: absolute;
                    width: ${HEX_WIDTH}px;
                    height: ${HEX_HEIGHT}px;
                    clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
                    transform-origin: center center;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    user-select: none;
                    will-change: transform; 
                }
                .honeycomb-content {
                    position: absolute;
                    inset: 4px;
                    clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    backdrop-filter: blur(4px);
                }
                .honeycomb-bg {
                    position: absolute;
                    inset: 0;
                    object-fit: cover;
                    width: 100%;
                    height: 100%;
                    opacity: 0.6;
                }
                .honeycomb-info {
                    position: absolute;
                    inset: 0;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    padding: 10px;
                    text-align: center;
                    z-index: 10;
                }
                .status-dot {
                    width: 8px;
                    height: 8px;
                    border-radius: 50%;
                    margin-top: 6px;
                    box-shadow: 0 0 5px currentColor;
                }
             `}</style>

            {/* NO wrapper div with transform, we calculate transform per item */}
            {businesses.map((business, i) => {
                const { q, r } = getSpiralCoords(i);

                // Base Position relative to (0,0)
                const baseX = HEX_SIZE * Math.sqrt(3) * (q + r / 2);
                const baseY = HEX_SIZE * 3 / 2 * r;

                // Applied Position (with Pan)
                const currentX = baseX + panState.x;
                const currentY = baseY + panState.y;

                // SPHERE PROJECTION LOGIC
                // Distance from viewport center
                // We use centerOffset.x/y as the "0,0" of the screen.
                // Distance is simple euclidean from (0,0) since currentX/Y are deviations from center.
                const dist = Math.sqrt(currentX * currentX + currentY * currentY);

                // Max radius for visibility/curve
                const MAX_RADIUS = 850; // Increased to widen view

                // If too far, don't render or fade out
                if (dist > MAX_RADIUS * 1.2) return null;

                // Calculate 3D transforms
                // Simulate curvature:
                // Rotation increases with distance.
                // Scale decreases slightly with distance (receding).

                // Normalize distance (0 at center, 1 at edge)
                const ratio = Math.min(dist / MAX_RADIUS, 1);

                // Rotation Angle (Sphere effect)
                // Items at X moves rotate around Y axis
                // Items at Y moves rotate around X axis
                const rotY = (currentX / MAX_RADIUS) * 70; // Increased rotation range
                const rotX = -(currentY / MAX_RADIUS) * 70;

                // Scale effect (Z-axis recession simulation)
                // Center is closest (scale 1). Edge is further (scale 0.5)
                const scale = 1 - (ratio * 0.3); // Less shrinkage

                // Z-translate (move back on sphere surface)
                // z = -R * (1 - cos(theta)) roughly? 
                // Simple approx: z = -dist * factor
                const translateZ = - (ratio * 100); // Less deep push

                const status = business.status || (Math.random() > 0.2 ? 'open' : 'closed');
                const statusColor = status === 'open' ? '#10b981' : '#ef4444';

                return (
                    <a
                        key={business.id}
                        href={`/business/${business.id}`}
                        className="honeycomb-item group"
                        style={{
                            left: centerOffset.x - (HEX_WIDTH / 2),
                            top: centerOffset.y - (HEX_HEIGHT / 2),
                            transform: `translate3d(${currentX}px, ${currentY}px, ${translateZ}px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale(${scale})`,
                            zIndex: Math.round(1000 - dist),
                            opacity: 1 - Math.pow(ratio, 3) // Smoother fade only at very edges
                        }}
                        onDragStart={(e) => e.preventDefault()}
                    >
                        <div className={`honeycomb-content shadow-lg border-2 
                            bg-white/90 border-white/50 
                            dark:bg-neutral-900/95 dark:border-white/10`}>
                            <img
                                src={business.image !== '/images/placeholder.jpg' ? business.image : `https://ui-avatars.com/api/?name=${business.name}&background=random`}
                                alt={business.name}
                                className="honeycomb-bg"
                            />
                            <div className="honeycomb-info bg-white/60 dark:bg-black/40">
                                <h3 className="font-bold text-xs md:text-sm leading-tight drop-shadow-sm text-neutral-900 dark:text-white" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.1) dark:0 2px 4px rgba(0,0,0,0.8)' }}>
                                    {business.name}
                                </h3>
                                <span className="text-[9px] text-blue-600 dark:text-blue-200 uppercase tracking-widest mt-1 opacity-90 font-bold">{business.category}</span>
                                <div className="status-dot" style={{ backgroundColor: statusColor }}></div>
                            </div>
                        </div>
                    </a>
                );
            })}
        </div>
    );
}
