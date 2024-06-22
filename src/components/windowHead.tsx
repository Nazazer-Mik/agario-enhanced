import "./css/windowHead.css";

export default function WindowHead({ text }: { text: string }) {
  return (
    <div className="window-head">
      <h2>{text}</h2>
    </div>
  );
}
