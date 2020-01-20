export const drawSubscriber = (options: DrawSubscriberOptions) => {
  const [path, [prevPosition, currentPosition]] = options;

  if (!path || !currentPosition) {
    return;
  }

  const currentDAttribute = path.getAttribute('d');

  const { clientX: prevClientX, clientY: prevClientY } = Object(prevPosition);
  const { clientX, clientY } = currentPosition;

  if (prevClientX && prevClientY) {
    path.setAttribute(
      'd',
      currentDAttribute
        ? `${currentDAttribute} L ${adjust(clientX)} ${adjust(clientY)}`
        : `M ${adjust(prevClientX)} ${adjust(prevClientY)} L ${adjust(
            clientX,
          )} ${adjust(clientY)}`,
    );
    return;
  }

  path.setAttribute(
    'd',
    currentDAttribute
      ? `${currentDAttribute} L ${adjust(clientX)} ${adjust(clientY)}`
      : `M ${adjust(clientX)} ${adjust(clientY)}`,
  );
};

function adjust(value: number) {
  // 20 is CSS margin of drawing space
  return value - 20;
}

type DrawSubscriberOptions = [SVGPathElement, MousePositions];
