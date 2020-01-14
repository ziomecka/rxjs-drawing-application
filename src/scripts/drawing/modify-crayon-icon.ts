enum CrayonIconWidth {
  Thin = 1,
  Medium = 3,
  Thick = 5,
}

export const modifyCrayonIcon = (
  $crayonIcon: SVGElement,
  classList: DOMTokenList,
) => {
  const removeWidthClasses = () => {
    classList.remove('crayon-icon--thick');
    classList.remove('crayon-icon--thin');
  };

  return ([isDrawing, [color, width]]: ApplicationState) => {
    Array.from($crayonIcon.querySelectorAll('path')).forEach(path =>
      path.setAttribute('fill', color),
    );

    if (isDrawing) {
      classList.remove('crayon-icon--not-drawing');
    } else {
      classList.add('crayon-icon--not-drawing');
    }

    switch (Number(width) as CrayonIconWidth) {
      case CrayonIconWidth.Thin: {
        removeWidthClasses();
        classList.add('crayon-icon--thin');
        break;
      }
      case CrayonIconWidth.Thick: {
        removeWidthClasses();
        classList.add('crayon-icon--thick');
        break;
      }
      default: {
        removeWidthClasses();
        break;
      }
    }
  };
};
