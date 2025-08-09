import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Signup from "./pages/Signup/Signup";
import Login from "./pages/Login/Login";
import Home from "./pages/Home/Home";
import AccountsChart from "./pages/AccountsChart";
import Disbursement from "./pages/Disbursement";
import CostCenter from "./pages/CostCenter";
import ServicBill from "./pages/ServicBill";
import AccountsStatement from "./pages/AccountsStatement";
import JournalEntry from "./pages/JournalEntry";
import Receipt from "./pages/Receipt";
import Layout from "./Layout/Layout";
import { Toaster } from "react-hot-toast";


export default function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        { index: true, element: <Login /> },

        { path: "Home", element: <Home /> },
        { path: "Receipt", element: <Receipt /> },
        { path: "Disbursement", element: <Disbursement /> },
        { path: "CostCenter", element: <CostCenter /> },
        { path: "ServicBill", element: <ServicBill /> },
        { path: "AccountsStatement", element: <AccountsStatement /> },
        { path: "JournalEntry", element: <JournalEntry /> },
        { path: "AccountsChart", element: <AccountsChart /> },
        { path: "Signup", element: <Signup /> },
      ],
    },
  ]);

  return (
    <>
      
          <RouterProvider router={router} />
     
      <Toaster position="top-right" />
    </>
  );
}
