import { createBrowserRouter } from "react-router";
import DashboardPage from '../features/Home/pages/DashboardPage';
import LandingPage from '../features/Home/pages/LandingPage';
import AuthPage from '../features/Auth/pages/AuthPage';
import VerifyOtpPage from '../features/Auth/pages/VerifyOtpPage';
import ProjectsPage from '../features/Home/pages/ProjectsPage';
import Protected from "../features/Auth/components/Protected";
import DocsPage from "../features/Home/pages/DocsPage";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <LandingPage />,
    },
    {
        path: "/auth",
        element: <AuthPage />,
    },
    {
        path: "/verify-otp",
        element: <VerifyOtpPage />,
    },
    {
        path: "/docs",
        element: <DocsPage />,
    },
    {
        path: "/projects",
        element: <Protected><ProjectsPage /></Protected>,
    },
    {
        path: "/dashboard",
        element: <Protected><DashboardPage /></Protected>,
    },
])