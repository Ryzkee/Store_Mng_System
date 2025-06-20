import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

function View({ items, setAllItems, setViewAllItems }) {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <Card className="w-94 "> 
        <CardHeader>
          <CardTitle>Purchase Details</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Items in this purchase:</p>
          <table className="text-sm w-full border-collapse">
            <thead>
              <tr className="border">
                <th className="px-4 py-2">Item Name</th>
                <th className="px-4 py-2">Qty</th>
                <th className="px-4 py-2">Price</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr>
                  <td colSpan="3" className="border px-4 py-2 text-center">
                    No items found.
                  </td>
                </tr>
              ) : (
                items.map((item, index) => (
                  <tr key={index}>
                    <td className="border px-2 py-2 overflow-hidden">{item.productName}</td>
                    <td className="border px-2 py-2 text-center">{item.qty}</td>
                    <td className="border px-2 py-2 text-between">
                      ₱ {item.price.toFixed(2)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
            <tfoot>
              <tr>
                <td className="border px-4 py-2 font-bold" colSpan="2">
                  Total
                </td>
                <td className="border px-4 py-2 text-between font-bold">
                  ₱{" "}
                  {items
                    .reduce((total, item) => total + item.price, 0)
                    .toFixed(2)}
                </td>
              </tr>
            </tfoot>
          </table>
          <div className="w-full">
            <Button className="mt-4" onClick={() => setViewAllItems(false)}>
              Close
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default View;
