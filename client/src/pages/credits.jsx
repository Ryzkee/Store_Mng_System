import { useState, useEffect } from "react";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { getallProducts, getSales, getCredits } from "@/support/helper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, UserRoundPlus, Search } from "lucide-react";

// Add this component above or below your main component:
function CreditListItem({ credit }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b py-2">
      <div
        className="flex justify-between items-center cursor-pointer"
        onClick={() => setOpen((o) => !o)}
      >
        <span className="font-semibold">{credit.name}</span>
        <span className="text-blue-600 font-bold">₱{credit.totalCredits}</span>
      </div>
      {open && (
        <ul className="pl-4 mt-2">
          {credit.items.map((item, i) => (
            <li key={i} className="flex justify-between text-sm">
              <span>{item.productName}</span>
              <span>₱{item.credits}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function Credits() {
  const [productsData, setProductsData] = useState([]);
  const [salesData, setSalesData] = useState([]);
  const [creditsList, setCreditsList] = useState([]);

  useEffect(() => {
    // Update the productsData state with the latest data
    getallProducts(setProductsData);
    // Update the salesData state with the latest sales data
    getSales(setSalesData);
    // Update the CreditsList with the latest data
    getCredits(setCreditsList);
  }, [productsData, salesData, creditsList]);

  //console.log(creditsList);
  return (
    <div className="flex flex-col items-center justify-start min-h-screen p-4">
      <h1 className="text-2xl font-bold">Credits</h1>
      <Card className={"w-full py-2"}>
        <div className="flex justify-end px-2">
          <Button className={"bg-blue-500"}>
            <UserRoundPlus className="" />
          </Button>
        </div>
        <div className="flex items-center w-full px-2 justify-between">
          <Input placeholder="Enter name" className={"w-[80%]"} />
          <Button className="" variant="outline">
            <Search className="" />
          </Button>
        </div>
        <CardContent>
          {creditsList
            .reduce((acc, curr) => {
              // Group by name and sum credits
              const found = acc.find((item) => item.name === curr.name);
              if (found) {
                found.totalCredits += Number(curr.credits);
                found.items.push(curr);
              } else {
                acc.push({
                  name: curr.name,
                  totalCredits: curr.credits,
                  items: [curr],
                });
              }
              return acc;
            }, [])
            .map((credit, idx) => (
              <CreditListItem key={credit.name + idx} credit={credit} />
            ))}
        </CardContent>
      </Card>
    </div>
  );
}

export default Credits;
