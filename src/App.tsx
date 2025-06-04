import Footer from './components/Footer';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/dashboard/Dashboard';
import './styles/globals.scss';

import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";

function App() {

  const Layout = () => {
    return (
      <div className="main">
        <Navbar />
        <div className="allContainer">
          <Sidebar />
          <div className="contentContainer">
            <Outlet />
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          path: "/",
          element: <Dashboard />
        },
      ]
    },
    {
      path: "/login",
      element: <Dashboard />
    }
  ])
  return (
    <RouterProvider router={router} />
  )

}
export default App
