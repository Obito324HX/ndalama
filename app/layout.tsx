import './globals.css';

export const metadata = {
  title: 'Ndalama',
  description: 'Mobile money reconciliation for small traders',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
