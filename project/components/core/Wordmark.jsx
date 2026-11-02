import React from 'react';
export function Wordmark({ inverse, size = 20 }) {
  return <span className={'ecos-wordmark' + (inverse ? ' ecos-wordmark--inverse' : '')} style={{ fontSize: size }}>Election-COS<sup>1.0</sup></span>;
}