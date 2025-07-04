import { useState, useEffect } from "react";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, UserRoundPlus, Search } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getCredits } from "@/support/helper";
import axios, { all } from "axios";

function AddPerson({ setAddPersonCredits, allItems, setAllItems }) {
  const [name, setName] = useState("");
  const [creditsList, setCreditsList] = useState([]);

  useEffect(() => {
    //update the data from the credits data
    getCredits(setCreditsList);
  },[creditsList])

  const handleAddPerson = async () => {

    if (!name) {
      alert('Please Enter the Credit Name!!');
      return;
    }

    // if (creditsList.some(person => person.name === name)) {
    //   alert('The Name that you Enter is already exists!');
    //   return;
    // }

    const personData = {
      name: name,
      items: allItems,
      totalCredit: allItems
        .reduce((acc, item) => acc + item.price, 0)
        .toFixed(2),
    };

    try {
      const response = await axios.post(
        "http://localhost:3000/add_credit_person",
        personData
      );

      // update stock quantities in the database
      try {
        const response = await axios.post(
          "http://localhost:3000/update_stock",
          allItems.map((item) => ({
            barcode: item.barcode,
            qty: item.qty,
          }))
        );

        if (response.status !== 200) {
          throw new Error("Failed to complete the purchase");
        }
        console.log(response.data);
      } catch (error) {
        console.error("Error updating stock quantities:", error);
        alert("Failed to update stock quantities. Please try again.");
        return;
      }

      if (!response.data.success) {
        throw new Error("Failed to Add Person");
      }
    } catch (error) {
      console.error("Error adding person:", error);
      alert("Failed to add person. Please try again.");
      return;
    }

    setAddPersonCredits(false);
    setName("");
    setAllItems([]);
  };

  //console.log(allItems);
  //console.log(name);
  return (
    <Card className={"w-90 mt-10"}>
      <CardTitle className={"flex justify-between items-center px-5"}>
        <h1>Add Credtis</h1>
      </CardTitle>
      <CardContent>
        <div>
          <label htmlFor="">New</label>
          <Input
            type={"text"}
            placeholder="Enter name"
            className={"w-full"}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="">Old</label>
          <Select className={"w-full"} value={name} onValueChange={setName}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Name" />
            </SelectTrigger>
            <SelectContent>
              {[...new Set(creditsList.map((c) => c.name))]
                .filter((n) => n && n.trim() !== "")
                .map((uniqueName) => (
                  <SelectItem key={uniqueName} value={uniqueName}>
                    {uniqueName}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>

        <table className="w-full mt-5">
          <thead>
            <tr className="border">
              <th className="w-[40%]">Name of Product</th>
              <th className="w-[20%]">Qty</th>
              <th className="w-[20%]">Price</th>
            </tr>
          </thead>
          <tbody>
            {allItems.map((item, index) => (
              <tr key={index}>
                <td className="w-[40%] text-start overflow-hidden px-2">
                  {item.productName}
                </td>
                <td className="w-[20%] text-centerr">{item.qty}</td>
                <td className="w-[20%] text-end px-2">
                  ₱{item.price.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot className="border-t-2">
            <tr>
              <td colSpan="2" className="font-bold px-2">
                Total:
              </td>
              <td className="text-end font-bold px-2">
                ₱
                {allItems
                  .reduce((total, item) => total + item.price, 0)
                  .toFixed(2)}
              </td>
            </tr>
          </tfoot>
        </table>

        <div className="flex items-center mt-5 w-full justify-between">
          <Button className={"bg-blue-500"} onClick={handleAddPerson}>
            ADD
          </Button>
          <Button
            className={"bg-red-500"}
            variant=""
            onClick={() => setAddPersonCredits(false)}
          >
            <X className="" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default AddPerson;
