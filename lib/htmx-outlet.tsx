import { type FC, useContext } from 'react';
import { UNSAFE_RouteContext, Outlet } from 'react-router';

export const HtmxOutlet: FC<{ className?: string }> = ({ className }) => {
  // TODO: see if there is an official hook
  // that can be used instead
  const context = useContext(UNSAFE_RouteContext);
  const lastMatch = context.matches[context.matches.length - 1];
  return (
    <div id={`outlet-${lastMatch.route.id}`} className={className}>
      <Outlet />
    </div>
  );
};
