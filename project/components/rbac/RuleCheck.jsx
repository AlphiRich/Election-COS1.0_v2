import React from 'react';
import { Icon } from '../core/Icon.jsx';
const ICON = { pass: 'check-circle', fail: 'x-circle', pending: 'circle-dashed' };
export function RuleCheck({ status = 'pending', children }) {
  return <div className={'ecos-rule ecos-rule--' + status}><Icon name={ICON[status]} /><div>{children}</div></div>;
}