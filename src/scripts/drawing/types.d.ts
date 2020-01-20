declare type MousePosition = { clientX: number; clientY: number };
declare type MousePositions = [MousePosition?, MousePosition?];

declare type DrawingStateModifier = (value: boolean) => boolean;
