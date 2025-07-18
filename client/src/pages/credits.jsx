import { useState, useEffect } from "react";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { getallProducts, getSales, getCredits } from "@/support/helper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  X,
  UserRoundPlus,
  Search,
  BanknoteArrowUp,
  Camera,
} from "lucide-react";
import axios from "axios";

//window for adding partial payment
function AddPartial({
  creditsList,
  partial,
  setPartial,
  setIsOpen,
  cPerson,
  apiUrl,
}) {
  const selectedPerson = cPerson;

  const handleIsOpen = () => {
    setIsOpen(false);
  };

  //calculate the Remaining Partial Amt
  const remainingPartialPayment = () => {
    let totalCredits;
    let remainingAmtToPay;
    const person = creditsList.filter((c) => c.name === selectedPerson);

    if (person.length === 0) return null;
    totalCredits = person.reduce((sum, c) => sum + c.totalCredit, 0);
    remainingAmtToPay = person ? person[0].partialpayment : 0;

    let remainingAmint = totalCredits - remainingAmtToPay;
    return remainingAmint;
  };

  //add a partial payment
  const handleAddPartialPayment = async () => {
    if (selectedPerson === "") {
      alert("Please select a person to pay");
      return;
    }

    if (partial > remainingPartialPayment()) {
      alert("You have entered an amount greater than the remaining balance!");
      return;
    }

    if (!partial || partial === "") {
      alert("Please enter a valid amount");
      return;
    }

    if (partial <= 0) {
      alert("Partial payment must be greater than 0");
      return;
    }

    const partialNum = Number(partial);
    const remaining = Number(remainingPartialPayment());

    if (partialNum === remaining) {
      try {
        // Send update to backend for full payment
        await axios.post(`${apiUrl}/delete_credit_by_name`, {
          name: selectedPerson,
        });
        alert("Full payment recorded successfully!");
      } catch (error) {
        console.error("Error updating full payment:", error);
        alert("Failed to record full payment. Please try again.");
      }
    } else if (partialNum < remaining) {
      // Proceed with partial payment
      try {
        // Find the selected person's credit entry
        const person = creditsList.find((c) => c.name === selectedPerson);
        if (!person) return;

        // Send update to backend
        await axios.post(`${apiUrl}/add_partial_payment`, {
          name: selectedPerson,
          partialpayment: Number(partial),
        });
        alert("Partial payment recorded successfully!");
      } catch (err) {
        // Handle error (optional: show notification)
        console.error(err);
        alert("Failed to record partial payment. Please try again.");
      }
    }

    setPartial("");
    setIsOpen(false);
    window.location.reload();
  };

  //console.log(selectedPerson);
  //console.log(creditsList);
  return (
    <Card className={"px-5"}>
      <div className="flex justify-between">
        <div>
          <h1 className="text-[12pt] font-bold mb-5">Enter Partial Payment</h1>
          <p>
            Partial Payment:{" ₱"}
            {(() => {
              const person = creditsList.find((c) => c.name === selectedPerson);
              return person ? (
                <span>{person.partialpayment.toFixed(2)}</span>
              ) : null;
            })()}
          </p>
          <p>
            Remaining Balance:{" ₱"}
            {(() => {
              const person = creditsList.find((c) => c.name === selectedPerson);
              return person ? (
                <span>{remainingPartialPayment().toFixed(2)}</span>
              ) : null;
            })()}
          </p>
        </div>

        <Button className={"bg-red-500"} onClick={handleIsOpen}>
          <X />
        </Button>
      </div>
      <h1 className="text-2xl">
        To: <span>{selectedPerson}</span>
      </h1>
      <p
        className={`w-full flex justify-center text-center  items-center bg-red-300 ${
          partial > remainingPartialPayment() ? "block" : "hidden"
        } px-4`}
      >
        Subra ang iyong nilagay! Ang kanyang Balanse ay nasa ₱
        {remainingPartialPayment > 0 ? remainingPartialPayment : 0}.00 lamang!!
      </p>
      <CardContent>
        <Input
          type="number"
          className={""}
          value={partial}
          onChange={(e) => setPartial(e.target.value)}
        />
      </CardContent>
      <Button className={"bg-blue-500"} onClick={handleAddPartialPayment}>
        Add
      </Button>
    </Card>
  );
}

// Main
function Credits({ apiUrl }) {
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
  }, []);

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

  // Handle opening the payment modal ************* adding a window for partial payment
  const handleIsOpen = () => {
    if (cPerson === "") {
      alert("Please select a person to pay");
      return;
    }

    setIsOpen(true);
  };

  //console.log(partial);
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
              Payment
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
            <thead className="border bg-blue-300">
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
                    <td className="pl-2">{cname.name}</td>
                    <td className="text-center">
                      {cname.dateLastCredited
                        ? new Date(cname.dateLastCredited).toLocaleDateString(
                            "en-GB"
                          )
                        : ""}
                    </td>
                    <td className="text-center">{cname.status}</td>
                    <td className="text-end pr-2">
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
          creditsList={creditsList}
          partial={partial}
          apiUrl={apiUrl}
        />
      </div>
    </div>
  );
}

export default Credits;
