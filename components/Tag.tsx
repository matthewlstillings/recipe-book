export default function Tag({ baked }: { baked: boolean }) {
  return <span className={`tag ${baked ? 'baked' : 'not-baked'}`}>{baked ? 'Baked' : 'Not baked'}</span>;
}
