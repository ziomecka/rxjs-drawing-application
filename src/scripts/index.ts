import {
  clean$,
  cleanSubscriber,
  menuDragEnd$,
  menuDragEndSubscriber,
} from './other/';
import { draw$, drawSubscriber } from './drawing/';

require('../style/index.sass');

draw$.subscribe(drawSubscriber);

clean$.subscribe(cleanSubscriber);

menuDragEnd$.subscribe(menuDragEndSubscriber);
