import { useState, useEffect } from "react";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getSales } from "@/support/helper";
import ViewOrder from "@/pages/order/viewOr";

function Sales() {
  const [salesData, setSalesData] = useState([]);
  const [search, setSearch] = useState("");
  const [searchDate, setSearchDate] = useState("");
  const [viewOrder, setViewOrder] = useState(false);
  const [selectedSaleId, setSelectedSaleId] = useState("");

  useEffect(() => {
    getSales(setSalesData);
  }, []);

  // Search by OR#
  const handleSearch = (e) => {
    const value = e.target.value;
    setSearch(value);
    if (value !== "") {
      setSearchDate(""); // Clear date search when OR# search is used
    }

    if (value === "") {
      // If search is empty, reload all sales data
      getSales(setSalesData);
      return;
    }

    getSales((allSales) => {
      setSalesData(allSales.filter((sale) => sale.orderId.includes(value)));
    });
  };

  // Search by date
  const handleDateSearch = (e) => {
    const value = e.target.value;
    setSearchDate(value);
    if (value !== "") {
      setSearch(""); // Clear OR# search when date search is used
    }

    if (value === "") {
      // If date search is empty, reload all sales data
      getSales(setSalesData);
      return;
    }

    getSales((allSales) => {
      setSalesData(
        allSales.filter((sale) => {
          const saleDate = new Date(sale.orderDate).toISOString().slice(0, 10);
          return saleDate === value;
        })
      );
    });
  };

  console.log(selectedSaleId);
  return (
    <div className="w-full h-screen flex flex-col justify-center items-center relative text-[12pt]">
      <Card className={"w-full h-full flex flex-col"}>
        <CardTitle className={" flex justify-between px-4 text-lg"}>
          Sales{" "}
          <p className="text-xl">
            Total:{" "}
            <span>
              {salesData
                .reduce((acc, sale) => acc + sale.totalPrice, 0)
                .toFixed(2)}
            </span>
          </p>
        </CardTitle>

        <CardContent>
          <div className="w-full flex">
            <div className="">
              <label htmlFor="">OR#</label>
              <Input
                placeholder="Search by OR#"
                value={search}
                onChange={handleSearch}
              />
            </div>
            <div className=" ml-5 flex flex-col justify-end">
              <label htmlFor="">Date</label>
              <Input
                type="date"
                value={searchDate}
                onChange={handleDateSearch}
                className="appearance-none"
              />
            </div>
          </div>
          <div className="w-full mt-5">
            <table className="w-full table-auto">
              <thead className="border">
                <tr>
                  <th className="w-[50%]">OR#</th>
                  <th className="w-[25%]">Date</th>
                  <th className="w-[25%]">Total</th>
                </tr>
              </thead>
              <tbody className="border">
                {salesData.map((sale, index) => (
                  <tr
                    key={sale._id}
                    className="border-b"
                    onDoubleClick={() => {
                      setViewOrder(true);
                      setSelectedSaleId(sale._id);
                    }}
                  >
                    <td className="w-[50%] text-start">{sale.orderId}</td>
                    <td className="w-[25%] text-center">
                      {new Date(sale.orderDate).toLocaleDateString()}
                    </td>
                    <td className="w-[25%] text-end px-2">
                      {" "}
                      {sale.totalPrice.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
      {/* View Order Component */}
      <div
        className={`w-full h-screen flex justify-center items-center absolute bg-[#acacac65]  ${
          viewOrder ? "block" : "hidden"
        }`}
      >
        <ViewOrder
          salesData={salesData.find((sale) => sale._id === selectedSaleId)}
          setViewOrder={setViewOrder}
          setSelectedSaleId={setSelectedSaleId}
        />
      </div>
    </div>
  );
}

export default Sales;
