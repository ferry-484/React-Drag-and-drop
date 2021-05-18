// import { ApolloProvider } from "@apollo/client";
// import client from "../apollo-client";
// import '../styles/app.css';
// <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css" integrity="sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh" crossorigin="anonymous">
  
// </link>
// export default function App({ Component, pageProps }) {
//     return (
//       <ApolloProvider client={client}>
//         <Component {...pageProps} />
//       </ApolloProvider>
//     );
//   }

import { ApolloProvider } from "@apollo/client";
import client from "../apollo-client";
import React, { useEffect } from "react";
import "../styles/app.css";
<link
  rel="stylesheet"
  href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css"
  integrity="sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh"
  crossorigin="anonymous"
></link>;


export default function App({ Component, pageProps }) {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      window.addEventListener("load", function () {
        navigator.serviceWorker.register("/sw.js").then(
          function (registration) {
            console.log(
              "Service Worker registration successful with scope: ",
              registration.scope
            );
          },

          function (err) {
            console.log("Service Worker registration failed: ", err);
          }
        );
      });
    }
  }, []);


  return (
    <ApolloProvider client={client}>
      <Component {...pageProps} />
    </ApolloProvider>
  );
}
