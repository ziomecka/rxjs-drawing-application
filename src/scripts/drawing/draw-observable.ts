import { $drawingSpace, $sidebar, INITIAL_STATE } from '../consts';
import { Observable, combineLatest, fromEvent, merge, of } from 'rxjs';
import {
  distinctUntilChanged,
  filter,
  map,
  mapTo,
  mergeMap,
  pairwise,
  pluck,
  scan,
  share,
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

const color$ = fromEvent<Event>($color, 'change').pipe(
  pluck<Event, string>('target', 'value'),
  startWith($color.value),
  distinctUntilChanged(),
);

const width$ = fromEvent<Event>($width, 'change').pipe(
  pluck<Event, string>('target', 'value'),
  startWith($width.value),
  distinctUntilChanged(),
);

const pathAttributes$ = combineLatest(color$, width$).pipe(
  tap(modifyAttributesCrayonIcon),
);

const drawingStateToggler: DrawingStateModifier = value => !value;
const drawingStateDisabler: DrawingStateModifier = () => false;

const drawingButtonClick$ = fromEvent<KeyboardEvent>(document, 'keypress').pipe(
  filter(({ key }) => key === 'd'),
  mapTo(drawingStateToggler),
);

const sidebarMouseDown$ = fromEvent($sidebar, 'mousedown').pipe(
  mapTo(drawingStateDisabler),
);

const isDrawing$ = merge(drawingButtonClick$, sidebarMouseDown$).pipe(
  scan((state, stateModifier) => stateModifier(state), INITIAL_STATE),
  distinctUntilChanged(),
  tap(modifyDrawingCrayonIcon),
  share(),
  startWith(INITIAL_STATE),
);

const mouseMove$ = fromEvent<MouseEvent>($drawingSpace, 'mousemove').pipe(
  map(({ clientX, clientY }) => ({ clientX, clientY })),
);

export const mousePositions$ = isDrawing$.pipe(
  switchMap<boolean, Observable<MousePosition>>(isDrawing =>
    isDrawing ? mouseMove$ : of(null),
  ),
  pairwise(),
);

const path$ = combineLatest(isDrawing$, pathAttributes$).pipe(
  mergeMap(([isDrawing, pathAttributes]) =>
    isDrawing ? of(createSvgPathElement(...pathAttributes)) : of(null),
  ),
);

export const draw$ = combineLatest(path$, mousePositions$);
