import { useParams } from 'solid-start';

export default function View() {
  const params = useParams();

  return (
    <div>
      This is a special view <span>{JSON.stringify(params)}</span>
    </div>
  );
}
