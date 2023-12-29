import ReactDOM from "react-dom/client";
import UploadPage from "./pages/UploadPage";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ProcessPage from "./pages/ProcessPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <UploadPage />,
  },
  {
    path: "/process",
    element: <ProcessPage />,
  },
]);

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(<RouterProvider router={router} />);
