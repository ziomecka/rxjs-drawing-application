import { $drawingSpace, $sidebar, INITIAL_STATE } from '../consts';
import { combineLatest, defer, fromEvent, iif, merge, of } from 'rxjs';
import {
  distinctUntilChanged,
  filter,
  map,
  mergeMap,
  pairwise,
  scan,
  startWith,
  switchMap,
  tap,
} from 'rxjs/operators';
import { createSvgPathElement } from './create-svg-path-element';
import { modifyCrayonIcon } from './modify-crayon-icon';

const $color = document.querySelector('#color') as HTMLInputElement;
const $width = document.querySelector('#width') as HTMLInputElement;
const $crayonIcon = document.querySelector('svg#crayon-icon') as SVGElement;

// ------------------------------------------------------------------ //
// PATH ATTRIBUTES
// ------------------------------------------------------------------ //

/**
 * Observable, emitted whenever the user changes the color
 * map extracts the color from the change event
 * startWith gives the initial color
 * distinctUntilChanged ensures that if the user selects twice the same color
 * then the stream does not emit
 */
const color$ = fromEvent($color, 'change').pipe(
  map((event: InputEvent) => (event.target as HTMLInputElement).value),
  startWith($color.value),
  distinctUntilChanged(),
);

/**
 * Observable, emitted whenever the user changes the width
 * map extracts the width from the change event
 * startWith gives the initial width
 * distinctUntilChanged ensures that if the user selects twice the same width
 * then the stream does not emit
 */
const width$ = fromEvent($width, 'change').pipe(
  map((event: InputEvent) => (event.target as HTMLInputElement).value),
  startWith($width.value),
  distinctUntilChanged(),
);

/**
 * Observable, combines two streams: color and width
 */
export const pathAttributes$ = combineLatest(color$, width$);

// ------------------------------------------------------------------ //
// DRAWING STATE
// ------------------------------------------------------------------ //

/**
 * Observable, the stream of 'toggle drawing'
 * filter ensures that only 'd's are emitted
 * map returns state toggling function
 */
const drawingButtonClick$ = fromEvent(document, 'keypress').pipe(
  filter(({ key }: KeyboardEvent) => key === 'd'),
  map(() => (value: boolean) => !value),
);

/**
 * Observable, the stream of 'turn off drawing'
 * Emits whenever the user starts to drag the sidebar
 * map returns set state to turn off drawing function
 */
const sidebarDragStart$ = fromEvent($sidebar, 'dragstart').pipe(
  map(() => () => false),
);

/**
 * Observable, the stream of 'turn off drawing'
 * Emits whenever the user clicks the sidebar
 * * map returns set state to turn off drawing function
 */
const sidebarClick$ = fromEvent($sidebar, 'click').pipe(map(() => () => false));

/**
 * Observable, the stream of 'on' / 'off' isDrawing state
 *
 * merge concurrently emits from drawingButtonClick, sidebarDragStart
 * and sidebarClick
 * scan runs the function that modifies the isDrawing state accumulates
 * the isDrawing state
 * startWith sets the initial isDrawing state
 */
export const isDrawing$ = merge(
  drawingButtonClick$,
  sidebarDragStart$,
  sidebarClick$,
).pipe(
  scan(
    (state, stateModifier: (value?: boolean) => boolean) =>
      stateModifier(state),
    INITIAL_STATE,
  ),
  startWith(INITIAL_STATE),
);

/**
 * Observable, combines two streams: isDrawing and [ color and width ]
 * tap ensures that whenever the state changes the crayon icon is modified
 */
const applicationState$ = combineLatest(isDrawing$, pathAttributes$).pipe(
  tap(modifyCrayonIcon($crayonIcon, $crayonIcon.classList)),
);

/**
 * Observable, emits svg path element or null
 *
 * Here we take the application state stream and pipe it via switchMap to get
 * the svg path element. We use switchMap() because we want to change the path
 * whenever the application state changes.
 *
 * If the color or width changes then a new svg path element is emitted
 * If the isDrawing state changes then a new path or null is emitted
 */
const path$ = applicationState$.pipe(
  switchMap(([isDrawing, [color, width]]) =>
    iif(
      () => isDrawing,
      defer(() => of(createSvgPathElement(color, width))),
      of(null),
    ),
  ),
);

/**
 * Observable, extracts mouse position from mouse move event
 * pairwise ensures that together with the current position the previous
 * position is emitted. As we have the previous mouse position there are no
 * holes in lines if the user changes the color or width while drawing
 */
const mouseMove$ = fromEvent($drawingSpace, 'mousemove').pipe(
  map(({ clientX, clientY }: MouseEvent) => ({ clientX, clientY })),
  pairwise(),
);

/**
 * Observable, extracts mouse position from mouse move event
 *
 * Here we take the isDrawing state and pipe it via mergeMap to get
 * either mouse moves or empty objects
 */
const mouse$ = isDrawing$.pipe(
  mergeMap(isDrawing => iif(() => isDrawing, mouseMove$, of([{}, {}]))),
);

/**
 * The final observable
 *
 * Emits either null and empty mouse moves or
 * svg path element and mouse moves (with current and previous mouse move)
 */
export const draw$ = combineLatest(path$, mouse$);
