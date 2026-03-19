export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'linear-gradient(135deg, #F7FFFE 0%, #E0F7F5 50%, #F7FFFE 100%)' }}>
      {/* Decorative elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute -top-40 -right-40 w-80 h-80 rounded-full opacity-20 animate-float"
          style={{ background: 'radial-gradient(circle, var(--accent) 0%, transparent 70%)' }}
        />
        <div
          className="absolute -bottom-20 -left-20 w-60 h-60 rounded-full opacity-15"
          style={{ background: 'radial-gradient(circle, var(--primary) 0%, transparent 70%)', animationDelay: '1.5s', animation: 'float 4s ease-in-out infinite' }}
        />
        <div
          className="absolute top-1/3 left-1/4 w-40 h-40 rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, var(--accent) 0%, transparent 70%)', animationDelay: '3s', animation: 'float 5s ease-in-out infinite' }}
        />
      </div>

      <div className="w-full max-w-md relative z-10">
        {children}
      </div>
    </div>
  );
}
