import { NavLink } from '../../../lib/components/nav-link';
import { HtmxOutlet } from '../../../lib/htmx-outlet';

const SettingsPage = () => (
  <>
    <div className="text-center text-8xl font-thin text-red-300">settings</div>
    <div className="mt-2 mx-auto">
      <div className="border">
        <div className="flex border-b rounded">
          <NavLink className="border-r" href="/settings/database">
            Database
          </NavLink>
          <NavLink className="border-r" href="/settings/graphics">
            Graphics
          </NavLink>
          <NavLink className="border-r" href="/settings/audio">
            Audio
          </NavLink>
        </div>

        <HtmxOutlet className="min-h-[10rem]" />
      </div>
    </div>
  </>
);

export default SettingsPage;
