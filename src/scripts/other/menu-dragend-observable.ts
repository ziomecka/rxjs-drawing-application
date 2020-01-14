import {
  map,
  switchMap,
} from 'rxjs/operators';
import { $sidebar } from '../consts';
import { fromEvent } from 'rxjs';

export const menuDragEnd$ = fromEvent($sidebar, 'dragstart').pipe(
  map(({ clientX, clientY }: DragEvent) => (
    { startClientX: clientX, startClientY: clientY }
  )),
  switchMap(
    ({ startClientX, startClientY }) => fromEvent($sidebar, 'dragend').pipe(
      map(({ clientX: endClientX, clientY: endClientY }: DragEvent) => (
        { startClientX, startClientY, endClientX, endClientY }
      )),
    ),
  ),
);
