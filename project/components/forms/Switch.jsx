import React from 'react';
export function Switch({ label, ...rest }) {
  return <label className="ecos-switch"><input type="checkbox" role="switch" {...rest} /><span>{label}</span></label>;
}