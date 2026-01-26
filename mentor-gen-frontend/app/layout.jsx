import "@/styles/globals.css";

export const metadata = {
  title: "Mentor Gen",
  description: "Mentor Gen app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50">
        {children}
      </body>
    </html>
  );
}
