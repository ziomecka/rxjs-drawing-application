export const drawSubscriber = ([
  [, prevPosition],
  [path, currentPosition],
]: DrawSubscriberOptions) => {
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
  // 20 is CSS margin value of drawing space
  return value - 20;
}

type DrawSubscriberOptions = [SVGPathElement?, MousePosition?][];
