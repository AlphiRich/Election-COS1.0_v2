import React from 'react';
export function Checkbox({ label, ...rest }) {
  return <label className="ecos-check"><input type="checkbox" {...rest} /><span>{label}</span></label>;
}