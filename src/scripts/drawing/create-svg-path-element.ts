import { $drawingSpace } from '../consts';

export const createSvgPathElement =
  (color: string, width: string) => {
    const $path = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'path',
    );

    $path.setAttribute('stroke', color);
    $path.setAttribute('stroke-width', width);
    $drawingSpace.append($path);

    return $path;
  };
