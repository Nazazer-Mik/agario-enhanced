import { ReactNode } from "react";
import "./css/windowBody.css";

export default function WindowBody({
  id,
  children,
}: {
  id: string;
  children: ReactNode;
}) {
  return (
    <div className="window-body" id={id}>
      <hr />
      {children}
    </div>
  );
}
