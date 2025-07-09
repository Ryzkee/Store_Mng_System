import { useState, useEffect } from "react";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { getallProducts, getSales, getCredits } from "@/support/helper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, UserRoundPlus, Search, BanknoteArrowUp, Camera } from "lucide-react";
import { useFormState } from "react-dom";

//window for adding partial payment
function AddPartial({ setPartial, setIsOpen, cPerson }) {
  const selectedPerson = cPerson;
  const handleIsOpen = () => {
    setIsOpen(false);
  };

  

  //console.log(selectedPerson);

  return (
    <Card className={"px-5"}>
      <div className="flex justify-between">
        <h1>Enter Partial Payment</h1>
        <Button className={"bg-red-500"} onClick={handleIsOpen}>
          <X />
        </Button>
      </div>
      <h1 className="text-3xl">To: <span>{selectedPerson}</span>
      </h1>
      <CardContent>
        <Input type="number" className={""} />
      </CardContent>
      <Button className={"bg-blue-500"}>Add</Button>
    </Card>
  );
}

// function for fullpayment method
function FullPayment({ setPartial, setFPisOpen, cPerson }) {
  const selectedPerson = cPerson;
  const handleIsOpen = () => {
    setFPisOpen(false);
  };
  return (
    <Card className={"px-5"}>
      <div className="flex justify-between">
        <h1>Enter Payment</h1>
        <Button className={"bg-red-500"} onClick={handleIsOpen}>
          <X />
        </Button>
      </div>
      <h1 className="text-3xl">
        To: <span>{selectedPerson}</span>
      </h1>
      <CardContent>
        <Input type="number" className={""} />
      </CardContent>
      <Button className={"bg-blue-500"}>Add</Button>
    </Card>
  );
};

// Main
function Credits() {
  const [productsData, setProductsData] = useState([]);
  const [salesData, setSalesData] = useState([]);
  const [creditsList, setCreditsList] = useState([]);
  const [searchName, setSearchName] = useState("");
  const [partial, setPartial] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [FPisOpen, setFPisOpen] = useState(false);

  //selected person to pay
  const [cPerson, setCPerson] = useState("");

  useEffect(() => {
    // Update the productsData state with the latest data
    getallProducts(setProductsData);
    // Update the salesData state with the latest sales data
    getSales(setSalesData);
    // Update the CreditsList with the latest data
    getCredits(setCreditsList);

  }, [productsData, salesData, creditsList]);

  //filter the search name on the creditsList
  const filteredCredits = creditsList.filter((credit) =>
    credit.name.toLowerCase().includes(searchName.toLowerCase())
  );

  // Calculate the total of all filtered credits
  const totalCredit = filteredCredits.reduce(
    (sum, credit) =>
      sum + (credit.totalCredit ? Number(credit.totalCredit) : 0),
    0
  );

  const handleIsOpen = () => { 
    setIsOpen(true);
  }

  const handleFPIsOpen = () => {
    setFPisOpen(true);
  };
  //console.log(cPerson);
  return (
    <div className="flex flex-col items-center justify-start min-h-screen p-4 relative">
      <h1 className="text-2xl font-bold">Credits</h1>
      <Card className={"w-full py-2"}>
        <div className="flex justify-between px-2">
          <p className="text-2xl">
            TOTAL: ₱ <span>{Number(totalCredit).toFixed(2)}</span>
          </p>
          <div className="flex items-center px-2 gap-1">
            <Button className={"bg-red-500 ml"} onClick={handleIsOpen}>
              Partial
            </Button>

            <Button className={"bg-blue-500"} onClick={handleFPIsOpen}>
              <BanknoteArrowUp className="" />
            </Button>
          </div>
        </div>
        <div className="flex items-center w-full px-2 justify-between">
          <Input
            placeholder="Enter name"
            className={"w-[80%]"}
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
          />
          <Button className="" variant="outline">
            <Search className="" />
          </Button>
        </div>
        <CardContent>
          <table className="w-full">
            <thead>
              <tr>
                <th className="">Name</th>
                <th>Date</th>
                <th>Status</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {filteredCredits.map((cname, index) => {
                return (
                  <tr
                    key={index}
                    onClick={() => setCPerson(cname.name)} // Set cPerson when row is clicked
                    className={`${cPerson == cname.name ? "bg-gray-200" : ""}`}
                    onDoubleClick={() => {
                      setCPerson(cname.name);
                      setIsOpen(true);
                    }}
                  >
                    <td>{cname.name}</td>
                    <td className="text-center">
                      {cname.dateLastCredited
                        ? new Date(cname.dateLastCredited).toLocaleDateString(
                            "en-GB"
                          )
                        : ""}
                    </td>
                    <td className="text-center">{cname.status}</td>
                    <td className="text-end">
                      ₱{Number(cname.totalCredit).toFixed(2)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </CardContent>
      </Card>
      {/* window for partial payment */}
      <div
        className={`w-full h-screen absolute flex justify-center items-center ${
          isOpen ? "block" : "hidden"
        }`}
      >
        <AddPartial
          setPartial={setPartial}
          setIsOpen={setIsOpen}
          cPerson={cPerson}
        />
      </div>
      <div
        className={`w-full h-screen absolute flex justify-center items-center ${
          FPisOpen ? "block" : "hidden"
        }`}
      >
        <FullPayment
          setPartial={setPartial}
          setFPisOpen={setFPisOpen}
          cPerson={cPerson}
        />
      </div>
    </div>
  );
}

export default Credits;
