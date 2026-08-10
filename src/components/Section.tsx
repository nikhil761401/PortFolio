import { ReactNode } from "react";
import Container from "./Container";

export default function Section({
  title,
  children,
  id,
}: {
  title?: string;
  children: ReactNode;
  id?: string;
}) {
  return (
    <section id={id} className="py-14">
      <Container>
        {title && (
          <h2 className="mb-6 text-xl font-semibold tracking-tight text-paper">
            {title}
          </h2>
        )}
        {children}
      </Container>
    </section>
  );
}
