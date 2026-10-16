import { Provider } from "react-redux";
import { RouterProvider } from "react-router";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { router } from "./routes";
import { store } from "./store";

export default function App() {
  return (
    <Provider store={store}>
      <RouterProvider router={router} />
      {/* Lives outside the router so toasts survive navigation */}
      <ToastContainer position="top-right" autoClose={4000} newestOnTop theme="colored" />
    </Provider>
  );
}
