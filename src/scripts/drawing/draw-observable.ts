import { $drawingSpace, $sidebar, INITIAL_STATE } from '../consts';
import { combineLatest, defer, fromEvent, iif, merge, of } from 'rxjs';
import {
  distinctUntilChanged,
  filter,
  map,
  pairwise,
  scan,
  startWith,
  switchMap,
  tap,
} from 'rxjs/operators';
import {
  modifyAttributesCrayonIcon,
  modifyDrawingCrayonIcon,
} from './modify-crayon-icon';
import { createSvgPathElement } from './create-svg-path-element';

const $color = document.querySelector('#color') as HTMLInputElement;
const $width = document.querySelector('#width') as HTMLInputElement;

const color$ = fromEvent($color, 'change').pipe(
  map((event: InputEvent) => (event.target as HTMLInputElement).value),
  startWith($color.value),
  distinctUntilChanged(),
);

const width$ = fromEvent($width, 'change').pipe(
  map((event: InputEvent) => (event.target as HTMLInputElement).value),
  startWith($width.value),
  distinctUntilChanged(),
);

export const pathAttributes$ = combineLatest(color$, width$).pipe(
  tap(modifyAttributesCrayonIcon),
);

const drawingButtonClick$ = fromEvent(document, 'keypress').pipe(
  filter(({ key }: KeyboardEvent) => key === 'd'),
  map(() => (value: boolean) => !value),
);

const sidebarDragStart$ = fromEvent($sidebar, 'dragstart').pipe(
  map(() => () => false),
);

const sidebarClick$ = fromEvent($sidebar, 'click').pipe(map(() => () => false));

const isDrawing$ = merge(
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
  tap(modifyDrawingCrayonIcon),
  distinctUntilChanged(),
);

const mouseMove$ = fromEvent($drawingSpace, 'mousemove').pipe(
  map(({ clientX, clientY }: MouseEvent) => ({ clientX, clientY })),
);

export const draw$ = combineLatest(isDrawing$, pathAttributes$).pipe(
  switchMap(([isDrawing, pathAttributes]) =>
    iif(
      () => isDrawing,
      combineLatest(
        defer(() => of(createSvgPathElement(...pathAttributes))),
        mouseMove$,
      ),
      combineLatest(of(null), of(null)),
    ),
  ),
  pairwise(),
);
