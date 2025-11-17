// pages/_app.js
import "../styles/globals.css";   // global base styles
import "../styles/auth.css";      // auth styles (login/signup)
import { Toaster } from "react-hot-toast";

function OptiStocks({ Component, pageProps }) {
  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
      <Component {...pageProps} />
    </>
  );
}

export default OptiStocks;
