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

function App() {
  const [users, setUsers] = useState([]);
  const [productsData, setProductsData] = useState([]);

  useEffect(() => {
    // Fetching username and products from the server
    getUsername(setUsers);
    getallProducts(setProductsData);
  }, []);

  //console.log(productsData);
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login users={users} />}/>
        <Route path="dashboard" element={<Dashboard />}>
          <Route index element={<DataList productsData={productsData} />} />
          <Route path="/dashboard/add_product" element={<AddProduct/>} />
          <Route path="/dashboard/view_list" element={<ViewList productData={productsData} />} />
          <Route path="/dashboard/purchase" element={<Purchase />} />
          <Route path="/dashboard/sales" element={<Sales />} />
          <Route path="/dashboard/credits" element={<Credits />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
