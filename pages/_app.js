import "@/styles/globals.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import '../pages/LandingPage.css';
import Head from "next/head";

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css"
        />
      </Head>
      <Component {...pageProps} />
    </>
  );
}
