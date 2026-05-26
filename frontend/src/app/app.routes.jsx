import { createBrowserRouter } from "react-router";
import DashboardPage from "../features/Home/pages/DashboardPage";
import LandingPage from "../features/Home/pages/LandingPage";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <LandingPage />,
    },
    {
        path: "/dashboard",
        element: <DashboardPage />,
    }
]);