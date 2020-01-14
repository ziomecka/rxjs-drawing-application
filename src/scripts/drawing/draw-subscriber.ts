// 20 is CSS margin value of drawing space
const adjust = (value: number) => value - 20;

export const drawSubscriber = ([
  path,
  [mousePosition, prevMousePosition],
]: DrawSubscriberOptions) => {
  if (path && mousePosition) {
    const currentDAttribute = path.getAttribute('d');
    const { clientX, clientY } = mousePosition;

    if (prevMousePosition) {
      const { clientX: prevClientX, clientY: prevClientY } = prevMousePosition;
      path.setAttribute(
        'd',
        currentDAttribute
          ? `${currentDAttribute} L ${adjust(clientX)} ${adjust(clientY)}`
          // eslint-disable-next-line max-len
          : `M ${adjust(prevClientX)} ${adjust(prevClientY)} L ${adjust(clientX)} ${adjust(clientY)}`,
      );
      return;
    }

    path.setAttribute(
      'd',
      currentDAttribute
        ? `${currentDAttribute} L ${adjust(clientX)} ${adjust(clientY)}`
        : `M ${adjust(clientX)} ${adjust(clientY)}`,
    );
  }
};

type DrawSubscriberOptions =
  [SVGPathElement | null, [MousePosition, MousePosition]];
