import { fromEvent } from 'rxjs';

const $cleanButton = document.querySelector(
  '#clean-button',
) as HTMLButtonElement;

export const clean$ = fromEvent($cleanButton, 'click');
