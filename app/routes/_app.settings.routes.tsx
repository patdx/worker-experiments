import { ROUTE_LOG } from '../../lib/all-routes';
import type { Route } from './+types/_app.settings.routes';

export async function loader() {
  return {
    ROUTE_LOG,
  };
}

const SettingsPageRoutes = ({ loaderData }: Route.ComponentProps) => {
  return (
    <div className="p-2">
      <pre>{loaderData.ROUTE_LOG}</pre>
    </div>
  );
};

export default SettingsPageRoutes;
