import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/login.jsx";
import Dashboard from "./pages/dashboard.jsx";
import AddProduct from "./pages/addproduct.jsx"
import ViewList from "./pages/viewlist.jsx";
import DataList from "./pages/monitoring.jsx";
import Sales from "./pages/sales.jsx";
import Purchase from "./pages/purchase.jsx";
import Credits from "./pages/credits.jsx";
import axios from "axios";
import { getUsername, getallProducts } from '@/support/helper.js';

function RequireAuth({ children }) {
  // Example: check if a token exists in localStorage
  const isLoggedIn = !!localStorage.getItem("token");
  return isLoggedIn ? children : <Navigate to="/" />;
}

function App() {
  const [users, setUsers] = useState([]);
  const [productsData, setProductsData] = useState([]);

  const apiUrl = 'https://store-mng-system-backebd.onrender.com';

  useEffect(() => {
    // Fetching username and products from the server
    getUsername(setUsers);
    getallProducts(setProductsData);
  }, []);

  //console.log(apiUrl);
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login users={users} apiUrl={apiUrl} />} />
        <Route
          path="dashboard"
          element={
            <RequireAuth>
              <Dashboard />
            </RequireAuth>
          }
        >
          <Route
            index
            element={<DataList productsData={productsData} apiUrl={apiUrl} />}
          />
          <Route
            path="/dashboard/add_product"
            element={<AddProduct apiUrl={apiUrl} />}
          />
          <Route
            path="/dashboard/view_list"
            element={<ViewList productData={productsData} apiUrl={apiUrl} />}
          />
          <Route
            path="/dashboard/purchase"
            element={<Purchase apiUrl={apiUrl} />}
          />
          <Route path="/dashboard/sales" element={<Sales />} />
          <Route
            path="/dashboard/credits"
            element={<Credits apiUrl={apiUrl} />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
