/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';

/**
 * withSuspense is a HOC that wraps a component with React.Suspense
 *
 * @param {JSX.Element} Component - The component to be wrapped
 * @param {JSX.Element} fallback - The fallback component to be rendered while the component is loading
 * @returns The wrapped component
 */
export default function withSuspense(Component, fallback) {
  return function SuspenseComponent(props) {
    return (
      <React.Suspense fallback={fallback}>
        <Component {...props} />
      </React.Suspense>
    );
  };
}
