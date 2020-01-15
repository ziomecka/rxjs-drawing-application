// 20 is CSS margin value of drawing space
const adjust = (value: number) => value - 20;

export const drawSubscriber = ([
  path,
  [
    { clientX: prevClientX, clientY: prevClientY } = {
      clientX: null,
      clientY: null,
    },
    { clientX, clientY } = {
      clientX: null,
      clientY: null,
    },
  ],
]: DrawSubscriberOptions) => {
  if (!path || !clientX || !clientY) {
    return;
  }

  const currentDAttribute = path.getAttribute('d');

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

type DrawSubscriberOptions = [
  SVGPathElement | null,
  [MousePosition, MousePosition],
];
