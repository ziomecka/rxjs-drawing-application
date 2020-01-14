import { $sidebar } from '../consts';

export const menuDragEndSubscriber = ({
  startClientX,
  startClientY,
  endClientX,
  endClientY,
}: MenuDragEndSubscriberOptions) => {
  const { left, top } = $sidebar.getBoundingClientRect();

  const diffX = endClientX - startClientX;
  const diffY = endClientY - startClientY;

  $sidebar.style.left = left + diffX + 'px';
  $sidebar.style.top = top + diffY + 'px';
};

type MenuDragEndSubscriberOptions = {
  startClientX: number;
  startClientY: number;
  endClientX: number;
  endClientY: number;
}
