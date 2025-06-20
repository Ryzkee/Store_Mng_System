import { useState, useEffect } from "react";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { getallProducts, getSales } from "@/support/helper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, UserRoundPlus, Search } from "lucide-react";

function Credits() {
  const [productsData, setProductsData] = useState([]);
  const [salesData, setSalesData] = useState([]);

  useEffect(() => {
    // Update the productsData state with the latest data
    getallProducts(setProductsData);
    // Update the salesData state with the latest sales data
    getSales(setSalesData);
  }, [productsData, salesData]);

  return (
    <div className="flex flex-col items-center justify-start min-h-screen p-4">
      <h1 className="text-2xl font-bold">Credits</h1>
      <Card className={"w-full py-2"}>
        <div className="flex justify-end px-2">
          <Button className={'bg-blue-500'}>
            <UserRoundPlus className="" />
          </Button>
        </div>
        <div className="flex items-center w-full px-2 justify-between">
          <Input placeholder="Enter name" className={"w-[80%]"} />
          <Button className="" variant="outline">
            <Search className="" />
          </Button>
        </div>
        <CardContent></CardContent>
      </Card>
    </div>
  );
}

export default Credits;
