import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { fromEvent, merge, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

enum SquiggleState {
    ready,
    animating,
    ended
}

interface Position {
    x: number;
    y: number;
}

interface SquiggleSet {
    path: SVGPathElement;
    settings: SquiggleSettings;
}

interface SquiggleSettings {
    x: number;
    y: number;
    directionX: number;
    directionY: number;
    length?: number;
    sections: number;
    width?: number;
    chunkLength?: number;
    color?: string;
    progress?: number;
    opacity?: number;
    // Index signature to allow dynamic access like settings['direction' + direction.toUpperCase()]
    [key: string]: any;
}

class Squiggle {
    private grid: number;
    private stage: HTMLElement | SVGElement;
    private sqwigs: SquiggleSet[] = [];
    public state: SquiggleState = SquiggleState.ready;

    constructor(stage: HTMLElement | SVGElement, settings: SquiggleSettings, grid: number) {
        this.grid = grid;
        this.stage = stage;

        settings.width = 0;
        settings.opacity = 1;

        this.state = SquiggleState.animating;
        let path = this.createLine(settings);
        let sqwigCount: number = 3;
        for (let i = 0; i < sqwigCount; i++) {
            this.createSqwig(i, sqwigCount, path, JSON.parse(JSON.stringify(settings)) as SquiggleSettings, i == sqwigCount - 1)
        }
    }

    createSqwig(index: number, total: number, path: string, settings: SquiggleSettings, forceWhite: boolean) {
        let sqwig = document.createElementNS("http://www.w3.org/2000/svg", 'path')
        sqwig.setAttribute('d', path)
        sqwig.style.fill = 'none';
        sqwig.style.stroke = forceWhite ? '#303030' : this.getColor();
        sqwig.style.strokeLinecap = "round"

        settings.length = sqwig.getTotalLength();
        settings.chunkLength = settings.length / 6;
        settings.progress = settings.chunkLength;

        sqwig.style.strokeDasharray = `${settings.chunkLength}, ${settings.length + settings.chunkLength}`
        sqwig.style.strokeDashoffset = `${settings.progress}`

        this.stage.appendChild(sqwig);

        this.sqwigs.unshift({ path: sqwig, settings: settings });

        gsap.to(settings, {
            duration: settings.sections * 0.1,
            progress: -settings.length,
            width: settings.sections * 0.9,
            ease: "power1.out",
            delay: index * (settings.sections * 0.01),
            onComplete: () => {
                if (index == total - 1) this.state = SquiggleState.ended;
                sqwig.remove();
            }
        });
    }

    public update() {
        this.sqwigs.forEach((set: SquiggleSet) => {
            set.path.style.strokeDashoffset = `${set.settings.progress}`;
            set.path.style.strokeWidth = `${set.settings.width}px`;
            set.path.style.opacity = `${set.settings.opacity}`;
        })
    }

    private createLine(settings: SquiggleSettings): string {
        let x = settings.x;
        let y = settings.y;
        let dx = settings.directionX;
        let dy = settings.directionY;
        let path: string[] = [
            'M',
            '' + x,
            '' + y,
            "Q"
        ]

        let steps = settings.sections;
        let step = 0;
        let getNewDirection = (direction: string, goAnywhere: boolean) => {
            if (!goAnywhere && settings['direction' + direction.toUpperCase()] != 0) return settings['direction' + direction.toUpperCase()];
            return Math.random() < 0.5 ? -1 : 1;
        }

        while (step < steps * 2) {
            step++;
            x += (dx * (step / 30)) * this.grid;
            y += (dy * (step / 30)) * this.grid;
            if (step != 1) path.push(',');
            path.push('' + x);
            path.push('' + y);

            if (step % 2 != 0) {
                dx = dx == 0 ? getNewDirection('x', step > 8) : 0;
                dy = dy == 0 ? getNewDirection('y', step > 8) : 0;
            }
        }

        return path.join(' ');
    }

    private getColor(): string {
        let offset = Math.round(Math.random() * 100)
        var r = Math.sin(0.3 * offset) * 100 + 155;
        var g = Math.sin(0.3 * offset + 2) * 100 + 155;
        var b = Math.sin(0.3 * offset + 4) * 100 + 155;
        return "#" + this.componentToHex(r) + this.componentToHex(g) + this.componentToHex(b);
    }

    private componentToHex(c: number) {
        var hex = Math.round(c).toString(16);
        return hex.length == 1 ? "0" + hex : hex;
    }
}

class Input {
    public starts: Observable<Position>;
    public moves: Observable<Position>;
    public ends: Observable<Position>;

    constructor(element: HTMLElement | Window) {
        // Mouse events
        const mouseDowns = fromEvent<MouseEvent>(element, "mousedown").pipe(map(this.mouseEventToCoordinate));
        const mouseMoves = fromEvent<MouseEvent>(window, "mousemove").pipe(map(this.mouseEventToCoordinate));
        // Check if element is window for mouseup/touchend to avoid type errors, though window usually works for global events
        const mouseUps = fromEvent<MouseEvent>(window, "mouseup").pipe(map(this.mouseEventToCoordinate));

        // Touch events - attaching to window/document mostly to capture everything
        const touchStarts = fromEvent<TouchEvent>(window, "touchstart").pipe(map(this.touchEventToCoordinate));
        const touchMoves = fromEvent<TouchEvent>(window, "touchmove").pipe(map(this.touchEventToCoordinate));
        const touchEnds = fromEvent<TouchEvent>(window, "touchend").pipe(map(this.touchEventToCoordinate));

        this.starts = merge(mouseDowns, touchStarts);
        this.moves = merge(mouseMoves, touchMoves);
        this.ends = merge(mouseUps, touchEnds);
    }

    private mouseEventToCoordinate = (mouseEvent: MouseEvent): Position => {
        // user-select: none prevents selection, but we don't want to preventDefault on everything
        // especially simple clicks. But for drawing trails, passive listener is usually better.
        return {
            x: mouseEvent.clientX,
            y: mouseEvent.clientY
        };
    };

    private touchEventToCoordinate = (touchEvent: TouchEvent): Position => {
        // touchEvent.preventDefault(); // Might block scrolling
        return {
            x: touchEvent.changedTouches[0].clientX,
            y: touchEvent.changedTouches[0].clientY
        };
    };
}

const MouseTrail = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const svgRef = useRef<SVGSVGElement>(null);
    const appRef = useRef<any>(null); // To store app state

    useEffect(() => {
        if (!containerRef.current || !svgRef.current) return;

        const container = containerRef.current;
        const svg = svgRef.current;
        let squiggles: Squiggle[] = [];
        let width = window.innerWidth;
        let height = window.innerHeight;
        let lastMousePosition: Position | null = null;
        let direction: Position | null = null;
        const grid = 40;
        let animationFrameId: number;

        const onResize = () => {
            width = window.innerWidth;
            height = window.innerHeight;
            svg.setAttribute('width', String(width));
            svg.setAttribute('height', String(height));
        };

        // Initial Resize
        onResize();
        window.addEventListener('resize', onResize);

        const createSqwigFromMouse = (position: Position) => {
            let sections: number = 4;
            if (lastMousePosition) {
                let newDirection: Position = { x: 0, y: 0 };
                let xAmount = Math.abs(lastMousePosition.x - position.x);
                let yAmount = Math.abs(lastMousePosition.y - position.y);

                if (xAmount > yAmount) {
                    newDirection.x = lastMousePosition.x - position.x < 0 ? 1 : -1;
                    sections += Math.round(xAmount / 4)
                }
                else {
                    newDirection.y = lastMousePosition.y - position.y < 0 ? 1 : -1;
                    sections += Math.round(yAmount / 4)
                }
                direction = newDirection;
            }

            if (direction && lastMousePosition) {
                let settings: SquiggleSettings = {
                    x: lastMousePosition.x,
                    y: lastMousePosition.y,
                    directionX: direction.x,
                    directionY: direction.y,
                    sections: sections > 20 ? 20 : sections
                }
                let newSqwig = new Squiggle(svg, settings, 10 + Math.random() * (sections * 1.5));
                squiggles.push(newSqwig);
            }

            lastMousePosition = position;
        }

        const createRandomSqwig = (fromMouse: boolean = false) => {
            let dx = Math.random();
            if (dx > 0.5) dx = dx > 0.75 ? 1 : -1;
            else dx = 0;
            let dy = 0;
            if (dx == 0) dx = Math.random() > 0.5 ? 1 : -1;

            let settings: SquiggleSettings = {
                x: fromMouse && lastMousePosition ? lastMousePosition.x : width / 2,
                y: fromMouse && lastMousePosition ? lastMousePosition.y : height / 2,
                directionX: dx,
                directionY: dy,
                sections: 5 + Math.round(Math.random() * 15)
            }
            let newSqwig = new Squiggle(svg, settings, grid / 2 + Math.random() * grid / 2);
            squiggles.push(newSqwig);
        }

        const tick = () => {
            let step = squiggles.length - 1;
            while (step >= 0) {
                if (squiggles[step].state != SquiggleState.ended) {
                    squiggles[step].update();
                } else {
                    // squiggles[step] = null; // Typescript doesn't like null in array of Squiggle
                    squiggles.splice(step, 1);
                }
                --step;
            }
            animationFrameId = requestAnimationFrame(tick);
        }

        // Start Loop
        tick();

        // Setup Input
        const input = new Input(window);

        const subs = [
            input.moves.subscribe((position: Position) => {
                // Create 3 squiggles per move
                for (let i = 0; i < 3; i++) createSqwigFromMouse(position);
            }),
            input.starts.subscribe((position: Position) => lastMousePosition = position),
            input.ends.subscribe((position: Position) => {
                // Burst on click/end
                for (let i = 0; i < 5; i++) createRandomSqwig(true);
            })
        ];

        // Cleanup
        return () => {
            window.removeEventListener('resize', onResize);
            cancelAnimationFrame(animationFrameId);
            subs.forEach(sub => sub.unsubscribe());
            // Also maybe clear SVG children?
            while (svg.firstChild) {
                svg.removeChild(svg.firstChild);
            }
        };

    }, []);

    return (
        <div
            ref={containerRef}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                pointerEvents: 'none',
                zIndex: 9999,
                overflow: 'hidden'
            }}
        >
            <svg
                ref={svgRef}
                width="100%"
                height="100%"
                xmlns="http://www.w3.org/2000/svg"
                style={{ width: '100%', height: '100%' }}
            ></svg>
        </div>
    );
};

export default MouseTrail;
