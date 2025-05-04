// @refresh reload
import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { Suspense } from "solid-js";
import { MetaProvider, Title, Link } from "@solidjs/meta";
import Header from "./components/Header";
import Timer from "./components/Timer";
import "./app.css";

export default function App() {
  return (
    <MetaProvider>
      {/* Set Title halaman */}
      <Title>Islamic App</Title>

      {/* Bootstrap CSS */}
      <Link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.5/dist/css/bootstrap.min.css" integrity="sha384-SgOJa3DmI69IUzQ2PVdRZhwQ+dy64/BUtbMJw1MZ8t5HZApcHrRKUc4W0kG879m7" crossorigin="anonymous" />
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css"></link>

      {/* Bootstrap JS Bundle (dengan Popper) */}
      <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.5/dist/js/bootstrap.bundle.min.js" integrity="sha384-k6d4wzSIapyDyv1kpU366/PK5hCdSbCRGRCMv+eplOQJWyd1fbcAu9OCUj5zNLiq" crossOrigin="anonymous" />

      {/* Routing dan Layout */}
      <Router
        root={(props) => (
          <div class="app-background">
            <Header />
            <div class="py-3 d-flex justify-content-center align-items-center">
              <Timer />
            </div>
            <Suspense>{props.children}</Suspense>
          </div>
        )}
      >
        <FileRoutes />
      </Router>
    </MetaProvider>
  );
}
