import "./globals.css";
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';


export const metadata = {
  title: "Meal Sharing App",
  description: "Find and share delicious meals!",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Header />
        <main>
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
