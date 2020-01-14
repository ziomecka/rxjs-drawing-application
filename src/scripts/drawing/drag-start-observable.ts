import { $sidebar } from '../consts';
import { fromEvent } from 'rxjs';

export const dragStart$ = fromEvent($sidebar, 'dragstart');
