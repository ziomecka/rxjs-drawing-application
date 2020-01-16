enum CrayonIconWidth {
  Thin = 1,
  Medium = 3,
  Thick = 5,
}

const $crayonIcon = document.querySelector('svg#crayon-icon') as SVGElement;
const { classList } = $crayonIcon;

export const modifyDrawingCrayonIcon = (isDrawing: boolean) => {
  if (isDrawing) {
    classList.remove('crayon-icon--not-drawing');
  } else {
    classList.add('crayon-icon--not-drawing');
  }
};

export const modifyAttributesCrayonIcon = ([color, width]: [
  string,
  string,
]) => {
  const removeWidthClasses = () => {
    classList.remove('crayon-icon--thick');
    classList.remove('crayon-icon--thin');
  };

  Array.from($crayonIcon.querySelectorAll('path')).forEach(path =>
    path.setAttribute('fill', color),
  );

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
