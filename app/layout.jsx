import './globals.css';
import { AuthProvider } from '../components/AuthProvider';
import Header from '../components/Header';

export const metadata = {
  title: 'Joungna News',
  description: 'Hacker News 스타일 게시판 - Next.js + Supabase',
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body>
        <AuthProvider>
          <div className="mx-auto my-2 max-w-[85%] min-w-[320px] bg-[#f6f6ef] md:max-w-[1100px]">
            <Header />
            <main className="px-2 py-3">{children}</main>
            <footer className="mt-6 border-t-2 border-[#ff6600] px-2 py-3 text-center text-[11px] text-[#828282]">
              Joungna News · Next.js + Tailwind CSS + Supabase
            </footer>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
