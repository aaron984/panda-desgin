function getClientPosition(elem) {
  let x;
  let y;
  const doc = elem.ownerDocument;
  const body = doc.body;
  const docElem = doc && doc.documentElement;
  const box = elem.getBoundingClientRect();
  x = box.left;
  y = box.top;
  x -= docElem.clientLeft || body.clientLeft || 0;
  y -= docElem.clientTop || body.clientTop || 0;
  return {
    left: x,
    top: y,
  };
}

export default function getOffsetLeft(el) {
  const pos = getClientPosition(el);
  const doc = el.ownerDocument;
  /* istanbul ignore next */
  const w = doc.defaultView || doc.parentWindow;
  pos.left += w.pageXOffset;

  return pos.left;
}
