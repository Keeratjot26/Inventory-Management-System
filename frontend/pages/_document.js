import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* ✅ Add meta tags / title to avoid ENOENT errors */}
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>OptiStocks</title>
      </Head>
      <body className="antialiased bg-gray-50 text-gray-900">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}