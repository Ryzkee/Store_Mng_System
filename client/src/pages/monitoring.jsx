import React from "react";
import { useState, useEffect } from "react";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { getallProducts, getSales } from "@/support/helper";

function DataList({ apiUrl }) {
  const [productsData, setProductsData] = useState([]);
  const [salesData, setSalesData] = useState([]);

  useEffect(() => {
    //update the productsData state with the latest data
    getallProducts(setProductsData);
    //update the salesData state with the latest sales data
    getSales(setSalesData);
  }, [productsData, salesData]);

  //console.log(salesData);
  return (
    <div className="flex flex-wrap gap-x-4  items-start  h-auto w-full min-h-screen p-4">
      <Card
        className={
          "p-4 w-42 h-45 hover:scale-105 transition-all hover:bg-gray-300"
        }
        onClick={() => (window.location.href = "/dashboard/view_list")}
      >
        <CardTitle className={"text-center h-10"}>Total Items</CardTitle>
        <CardContent className={"text-center text-6xl"}>
          {productsData.length}
        </CardContent>
      </Card>
      <Card
        className={
          "p-4 w-42 h-45 hover:scale-105 transition-all hover:bg-gray-300"
        }
        onClick={() => (window.location.href = "/dashboard/view_list")}
      >
        <CardTitle className={"text-center h-10"}>
          Total of Out of Stock Items
        </CardTitle>
        <CardContent className={"text-center text-6xl"}>
          {productsData.filter((item) => item.stockQty === 0).length}
        </CardContent>
      </Card>
      <Card
        className={
          "p-4 w-42 h-45 hover:scale-105 transition-all hover:bg-gray-300"
        }
        onClick={() => (window.location.href = "/dashboard/sales")}
      >
        <CardTitle className={"text-center h-10"}> Daily sales</CardTitle>
        <CardContent className={"text-center text-[15pt]"}>
          ₱{" "}
          {(salesData.length > 0
            ? salesData
                .filter((item) => {
                  const today = new Date();
                  const saleDate = new Date(item.orderDate);
                  return (
                    saleDate.getDate() === today.getDate() &&
                    saleDate.getMonth() === today.getMonth() &&
                    saleDate.getFullYear() === today.getFullYear()
                  );
                })
                .reduce((total, item) => total + item.totalPrice, 0)
            : 0
          ).toFixed(2)}
        </CardContent>
      </Card>
      <Card
        className={
          "p-4 w-42 h-45 hover:scale-105 transition-all hover:bg-gray-300"
        }
      >
        <CardTitle className={"text-center h-10"}>
          Total Sales Revenue
        </CardTitle>
        <CardContent className={"text-center text-6xl"}>0</CardContent>
      </Card>
      <Card
        className={
          "p-4 w-42 h-45 hover:scale-105 transition-all hover:bg-gray-300"
        }
      >
        <CardTitle className={"text-center h-10"}>Total Profit</CardTitle>
        <CardContent className={"text-center text-6xl"}>0</CardContent>
      </Card>
      <Card
        className={
          "p-4 w-42 h-45 hover:scale-105 transition-all hover:bg-gray-300"
        }
        onClick={() => (window.location.href = "/dashboard/view_list")}
      >
        <CardTitle className={"text-center h-10"}>Total Investment</CardTitle>
        <CardContent className={"text-center text-6xl"}>0</CardContent>
      </Card>
    </div>
  );
}

export default DataList;
