/** ApplicationState  [ isDrawing, [ color, width ] ] */
declare type ApplicationState = [boolean, [string, string]];

declare type MousePosition = { clientX: number; clientY: number };
declare type MousePositions = [MousePosition?, MousePosition?];
