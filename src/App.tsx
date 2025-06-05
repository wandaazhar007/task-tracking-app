import Footer from './components//footer/Footer';
import Navbar from './components/navbar/Navbar';
import About from './pages/about/About';
import Dashboard from './pages/dashboard/Dashboard';
import './styles/globals.scss';

import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";

function App() {

  const Layout = () => {
    return (
      <div className="main">
        <Navbar />
        <div className="allContainer">
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
      path: "/about",
      element: <About />
    }
  ])
  return (
    <RouterProvider router={router} />
  )

}
export default App
