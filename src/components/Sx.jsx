import React from 'react';

/** Element with inline hover / focus / active styles (replaces the prototype's style-hover / style-focus / style-active). Passes refs on, so dialogs can focus it. */
const Sx = React.forwardRef(function Sx({ as: Tag = 'div', hover, focus, active, style, onMouseEnter, onMouseLeave, onFocus, onBlur, onMouseDown, onMouseUp, children, ...rest }, ref) {
  const [h, setH] = React.useState(false);
  const [f, setF] = React.useState(false);
  const [a, setA] = React.useState(false);
  const merged = { ...style, ...(h ? hover : null), ...(f ? focus : null), ...(a ? active : null) };
  return (
    <Tag
      {...rest}
      ref={ref}
      style={merged}
      onMouseEnter={e => { setH(true); onMouseEnter && onMouseEnter(e); }}
      onMouseLeave={e => { setH(false); setA(false); onMouseLeave && onMouseLeave(e); }}
      onFocus={e => { setF(true); onFocus && onFocus(e); }}
      onBlur={e => { setF(false); onBlur && onBlur(e); }}
      onMouseDown={e => { setA(true); onMouseDown && onMouseDown(e); }}
      onMouseUp={e => { setA(false); onMouseUp && onMouseUp(e); }}
    >
      {children}
    </Tag>
  );
});

export default Sx;
