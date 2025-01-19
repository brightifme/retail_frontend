import { Html, Head, Main, NextScript } from "next/document";
import Script from 'next/script';

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body>
        <Main />
        <Script src="https://cdn.jsdelivr.net/npm/secugen-webapi@1.0.0/dist/secugen-webapi.min.js" defer />
        <NextScript />
      </body>
    </Html>
  );
}
