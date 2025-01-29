import React from "react";
import ReactDOM from "react-dom/client";
import "bootswatch/dist/lumen/bootstrap.min.css";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { AuthProvider } from "oidc-react";
import configData from "./config.json";

const root = ReactDOM.createRoot(document.getElementById("root"));
const oidcConfig = {
  onSignIn: async (user) => {
    alert("You just logged in!");
    window.location.hash = "";
  },

  authority: "https://login.elixir-czech.org/oidc",
  clientId: process.env.REACT_APP_CLIENT_ID,
  clientSecret: process.env.REACT_APP_CLIENT_SECRET,
  autoSignIn: false,
  responseType: "code",
  automaticSilentRenew: true,
  redirectUri:
    process.env.NODE_ENV === "development" && configData.REDIRECT_URL,
  postLogoutRedirectUri:
    process.env.NODE_ENV === "development" &&
    configData.POST_LOGOUT_REDIRECT_URL,
  scope: "openid profile email ga4gh_passport_v1 offline_access",
  revokeAccessTokenOnSignout: true,
  silentRedirectUri: `${window.location.origin}/silent-renew.html`,
};

// console.log("Redirect URI:", oidcConfig.redirectUri);
// console.log("postLogoutRedirectUri:", oidcConfig.postLogoutRedirectUri);
// console.log("silentRedirectUri:", oidcConfig.silentRedirectUri);
// console.log("Window Location Origin:", window.location.origin);
// console.log("oidcConfig:", oidcConfig);

root.render(
  <React.StrictMode>
    <AuthProvider {...oidcConfig}>
      <App />
    </AuthProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
