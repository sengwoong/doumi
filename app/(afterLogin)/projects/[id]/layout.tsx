export default function ProjectLayout({
  children,
  modal
}: {
  children: React.ReactNode
  modal: React.ReactNode
}) {
  return (
    <section className="relative min-h-screen">
      <div className="main-content">
        {children}
      </div>
      {modal && (
        <div className="modal-container">
          {modal}
        </div>
      )}
    </section>
  );
}
