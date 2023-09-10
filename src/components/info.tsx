export default function InfoComponent(props: any) {
  return (
    <li className="list-group-item d-flex justify-content-center align-items-center info-panel">
      <span className="info-content">{props.words}</span>
    </li>
  );
}
