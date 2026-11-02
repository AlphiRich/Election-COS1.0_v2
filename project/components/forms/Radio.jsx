import React from 'react';
export function Radio({ label, ...rest }) {
  return <label className="ecos-check"><input type="radio" {...rest} /><span>{label}</span></label>;
}