import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

function ViewOrder({ salesData, setViewOrder, setSelectedSaleId }) {
  return (
    <Card className={"w-[90%] py-4 text-[15pt]"}>
      <CardHeader className={"px-5"}>
        <div className="flex items-center justify-end w-full h-10">
          <Button
            variant="ghost"
            className="p-0 h-full w-10"
            onClick={() => {
              setViewOrder(false);
              setSelectedSaleId("");
            }}
          >
            <X size={20} color="red"/>
          </Button>
        </div>
        <CardTitle>Order Details</CardTitle>
      </CardHeader>
      <CardContent>
        {salesData ? (
          <div className="overflow-x-auto">
            <p>Order ID: {salesData.orderId}</p>
            <p>Date: {new Date(salesData.orderDate).toLocaleDateString()}</p>
            <h3>Items:</h3>
            <table className="w-full table-auto">
              <thead>
                <tr>
                  <th className="w-[25%] text-start overflow-hidden whitespace-nowrap text-ellipsis">Bc#</th>
                  <th className="w-[50%] text-start overflow-hidden whitespace-nowrap text-ellipsis">P.Name</th>
                  <th className="w-[25%] text-center">Qty</th>
                  <th className="w-[25%] text-end">Price</th>
                </tr>
              </thead>
              <tbody>
                {salesData.items.map((item, index) => (
                  <tr key={index}>
                    <td className="text-start overflow-hidden whitespace-nowrap text-ellipsis max-w-[100px]">{item.barcode}</td>
                    <td className="text-start overflow-hidden whitespace-nowrap text-ellipsis max-w-[100px]">{item.productName}</td>
                    <td className="text-center">{item.qty}</td>
                    <td className="text-end">{item.price.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="border-t border-black mt-5">
                <tr>
                  <td colSpan="3">Total Price</td>
                  <td className="font-bold">{salesData.totalPrice.toFixed(2)}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        ) : (
          <p>No order selected</p>
        )}
      </CardContent>
    </Card>
  );
}

export default ViewOrder;
