import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Dice1, Search } from "lucide-react";
import { getallProducts } from "@/support/helper";
import WindowRemoveItem from "./purchase/remove";
import WindowView from "./purchase/view";
import AddPersonCredits from "./credit/addPersonCredits"
import axios from "axios";

function Purchase({ apiUrl }) {
  const [productsData, setProductsData] = useState([]);
  const [searchBcode, setsearchBcode] = useState("");
  const [foundItem, setFoundItem] = useState(null);
  const [valuePrice, setvaluePrice] = useState("Retail");
  const [qty, setQty] = useState("1");
  const [pId, setPId] = useState(""); // Product ID, if needed
  const [removeItem, setRemoveItem] = useState(false);
  const [viewAllItems, setViewAllItems] = useState(false);
  const [finalPrice, setFinalPrice] = useState("0.00");
  const [manualPrice, setManualPrice] = useState("Auto");
  const [addPersonCredits, setAddPersonCredits] = useState(false);

  //store data
  const [allItems, setAllItems] = useState([]);

  useEffect(() => {
    // Fetch all products data and update the state
    getallProducts(setProductsData);

    //check the qty selected if it is greater than the stockQty
    if (foundItem && Number(qty) > foundItem.stockQty) {
      alert("Insufficient stock quantity.");
      setQty(foundItem.stockQty.toString()); // Reset and display the available stock qty
      setvaluePrice("Retail"); // Reset to Retail price
    }

    // Update the final price: Auto mode uses calculated price, Manual uses user input
    if (manualPrice === "Auto") {
      setFinalPrice(productTotalPrice.toFixed(2));
    }

    // Set the quantity based on the selected price value
    if (valuePrice === "Wholesalex12") {
      setQty("12");
    } else if (valuePrice === "Wholesalex10") {
      setQty("10");
    } else if (valuePrice === "Wholesalex6") {
      setQty("6");
    } else if (valuePrice === "Wholesalex5") {
      setQty("5");
    }

    // remove data if the searchBcode is empty
    if (searchBcode.length === 0) {
      setFoundItem(null);
      setvaluePrice("Retail");
      setQty("1");
    }
  }, [productsData]);

  //search item
  const handleSearch = () => {
    const item = productsData.find((bcode) => bcode.barcode === searchBcode);
    setFoundItem(item || null);
  };

  // handle add product
  const handleAddProduct = () => {
    if (!foundItem) {
      alert("Please search for a product first.");
      return;
    }

    const item = {
      barcode: foundItem.barcode,
      productName: foundItem.productName,
      qty: Number(qty),
      price: manualPrice === "Manual" ? Number(finalPrice) : productTotalPrice,
    };

    if (allItems.some((i) => i.productName === foundItem.productName)) {
      alert("Item already exists in the list.");
      return;
    }

    setAllItems([...allItems, item]);
    setsearchBcode("");
    setFoundItem(null);
    setvaluePrice("Retail");
    setQty("1");
    setFinalPrice("0.00");
    setManualPrice("Auto");
    console.log("Added item:", item);
    console.log("All items:", allItems);
  };

  // find product
  const findProduct = productsData.filter(
    (items) =>
      items.productName.toLowerCase().includes(searchBcode.toLowerCase()) ||
      items.barcode.toLowerCase().includes(searchBcode.toLowerCase())
  );

  //select items
  const selectItems = (index) => {
    return () => {
      const selectedItem = findProduct[index];
      if (selectedItem) {
        setFoundItem(selectedItem);
        setsearchBcode(selectedItem.barcode);
      }
    };
  };

  // product pricing based on status
  const productPricing = (status) => {
    switch (status) {
      case "Retail":
        return foundItem ? foundItem.unitPrice : 0;
      case "Wholesalex12":
        return foundItem ? foundItem.unitPrice * 12 + 2 : 0;
      case "Wholesalex10":
        return foundItem ? foundItem.unitPrice * 10 + 2 : 0;
      case "Wholesalex6":
        return foundItem ? foundItem.unitPrice * 6 + 2 : 0;
      case "Wholesalex5":
        return foundItem ? foundItem.unitPrice * 5 + 2 : 0;
      default:
        return 0;
    }
  };

  //total price
  const productTotalPrice = productPricing(valuePrice) * Number(qty);

  //handle buy
  const handleBuy = async () => {
    if (allItems.length === 0) {
      alert("No items to buy.");
      return;
    }

    // Proceed with the purchase logic
    const purchaseDetails = {
      orderId: `ORD-${new Date().getTime()}`, // Generate a unique order ID
      items: allItems,
      totalPrice: allItems
        .reduce((acc, item) => acc + item.price, 0)
        .toFixed(2),
    };

    try {
      const response = await axios.post(
        `${apiUrl}/add_purchase`,
        purchaseDetails
      );
      if (response.status !== 200) {
        throw new Error("Failed to complete the purchase");
      }

      // update stock quantities in the database
      try {
        const response = await axios.post(
          `${apiUrl}/update_stock`,
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

      alert("Purchase completed successfully!");
      setAllItems([]); // Clear the items after purchase
      setPId(""); // Reset selected product ID
      setFoundItem(null); // Clear found item
      setsearchBcode(""); // Clear search input
    } catch (error) {
      console.error("Error during purchase:", error);
      alert("Failed to complete the purchase. Please try again.");
      return;
    }
    console.log("Purchase Details:", purchaseDetails);
  };

  //console.log(allItems);
  //console.log(apiUrl);
  return (
    <div className="p-1 relative">
      {/* all add product to buy */}
      <div className="flex flex-col full h-auto border-b-2 border-black mb-2">
        <Card className={"w-[100%] h-[80%] p-1 gap-0"}>
          <CardTitle
            className={"w-full h-[10%] px-2 text-[13pt] flex justify-between"}
          >
            List of Products
            <p className="p-2 font-bold text-[15pt] underline">
              Total :{" "}
              <span>
                {allItems.reduce((acc, item) => acc + item.price, 0).toFixed(2)}
              </span>
            </p>
          </CardTitle>
          <CardContent className={"w-full h-[90%] rounded-md px-1 mt-0 py-0"}>
            <div className="flex justify-between text-[10pt] font-bold p-1 h-[10%] pb-2 border-b-2 border-black">
              <p className="w-[60%]">Name of Product</p>
              <p className="w-[15%] text-center">Qty</p>
              <p className="w-[25%] text-end">Price</p>
            </div>
            <div className="h-[82%] overflow-y-auto bg-green-100 px-1">
              {allItems.map((items, index) => {
                return (
                  <div
                    key={items.productName}
                    onClick={() => setPId(index)}
                    className={`${pId === index ? "bg-green-300" : ""}`}
                  >
                    <div className="flex justify-between py-1 border-b-1 hover:bg-green-300 overflow-hidden items-center">
                      <p className="text-[12pt] w-[60%] ">
                        {items.productName}
                      </p>
                      <p className="text-[12pt] w-[15%] text-center">
                        {items.qty}
                      </p>
                      <p className="text-[12pt] w-[25%] text-end">
                        {items.price.toFixed(2)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
        <div className="w-[100%] h-[20%] gap-1 px-1 flex flex-row py-1 items-center justify-start mb-3">
          <Button
            onClick={() => {
              if (pId === "") {
                alert("Please select an item to remove.");
                return;
              }
              setRemoveItem(true);
            }}
            className={"bg-red-500 text-white"}
          >
            Remove
          </Button>
          <Button
            onClick={() => {
              setViewAllItems(true);
            }}
            className={"bg-green-500 text-white"}
          >
            View
          </Button>
          <Button className={"px-5 bg-blue-500 text-white"} onClick={handleBuy}>
            Buy
          </Button>
          <Button
            className={"px-4 bg-violet-500 text-white"}
            onClick={() => setAddPersonCredits(true)}
          >
            Credits
          </Button>
        </div>
      </div>
      {/* menu */}
      <div className="w-full h-80  p-1">
        <Card className={"px-5"}>
          <div>
            <div className="mb-5">
              <label htmlFor="">Barcode / Item Name</label>
              <div className="w-full flex justify-between">
                <Input
                  type={"search"}
                  className={"w-[85%]"}
                  placeholder="Search Barcode. . ."
                  value={searchBcode}
                  onChange={(e) => setsearchBcode(e.target.value)}
                />
                <Button onClick={handleSearch}>
                  <Search />
                </Button>
              </div>
            </div>
            <div
              className={`w-full h-auto ${
                searchBcode.length === 0 ? "hidden" : "block"
              } p-2 border-2 mb-2`}
            >
              {findProduct.map((items, index) => {
                return (
                  <div
                    key={index}
                    className="flex justify-between mb-2 border-b-2 hover:bg-gray-200 p-2"
                    onClick={selectItems(index)}
                  >
                    <p className="text-[12pt] font-bold">{items.productName}</p>
                    <p className="text-[12pt] font-bold">{items.barcode}</p>
                  </div>
                );
              })}
            </div>
            <div className="flex">
              <label htmlFor="" className="text-[12pt] w-50">
                Product Name:
              </label>
              <p className="ml-3 font-bold overflow-hidden w-100">
                {foundItem ? foundItem.productName : ""}
              </p>
            </div>
            <div className="flex text-[15pt]">
              <div className="w-[65%] flex">
                <label htmlFor="">Stocks:</label>
                <p className="ml-3 font-bold">
                  {foundItem ? foundItem.stockQty : ""}
                </p>
              </div>
              <div className="w-[35%] flex justify-end items-center">
                <Select
                  className={"w-full"}
                  value={manualPrice}
                  onValueChange={setManualPrice}
                >
                  <SelectTrigger className="w-[150px] ml-4">
                    <SelectValue placeholder="Auto" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Auto">Auto</SelectItem>
                    <SelectItem value="Manual">Manual</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex text-[15pt]">
              <div className="w-[65%] h-30">
                <div className="flex text-[15pt] items-center">
                  <label htmlFor="">Status: </label>
                  <Select
                    className={"w-full"}
                    value={valuePrice}
                    onValueChange={setvaluePrice}
                  >
                    <SelectTrigger className="w-[150px] ml-4">
                      <SelectValue placeholder="Retail" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Retail">Retail</SelectItem>
                      <SelectItem value="Wholesalex12">Wholesalex12</SelectItem>
                      <SelectItem value="Wholesalex6">Wholesalex6</SelectItem>
                      <SelectItem value="Wholesalex10">Wholesalex10</SelectItem>
                      <SelectItem value="Wholesalex5">Wholesalex5</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex text-[15pt] mt-1">
                  <label htmlFor="">Qty:</label>
                  <Select
                    className={"w-full"}
                    value={qty}
                    onValueChange={setQty}
                  >
                    <SelectTrigger className="w-[80px] ml-4">
                      <SelectValue placeholder="1" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1</SelectItem>
                      <SelectItem value="2">2</SelectItem>
                      <SelectItem value="3">3</SelectItem>
                      <SelectItem value="4">4</SelectItem>
                      <SelectItem value="5">5</SelectItem>
                      <SelectItem value="6">6</SelectItem>
                      <SelectItem value="7">7</SelectItem>
                      <SelectItem value="8">8</SelectItem>
                      <SelectItem value="9">9</SelectItem>
                      <SelectItem value="10">10</SelectItem>
                      <SelectItem value="11">11</SelectItem>
                      <SelectItem value="12">12</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  className={"mt-2 w-[95%] bg-blue-500"}
                  onClick={handleAddProduct}
                >
                  ADD
                </Button>
              </div>
              <Card
                className={
                  "text-center w-[35%] flex flex-col items-center px-0 pb-0"
                }
              >
                <CardTitle className={" w-full"} htmlFor="">
                  Price
                </CardTitle>
                <CardContent className={"w-full text-green-400 h-[50px] px-0"}>
                  <Input
                    type="text"
                    value={Number(finalPrice).toFixed(2)}
                    onChange={
                      manualPrice === "Manual"
                        ? (e) => setFinalPrice(e.target.value)
                        : undefined
                    }
                    readOnly={manualPrice !== "Manual"}
                    className={
                      "border-none text-center text-[15pt] font-bold w-full px-0"
                    }
                  />
                </CardContent>
              </Card>
            </div>
          </div>
        </Card>
      </div>
      {/* remove item */}
      <div
        className={`${
          removeItem ? "block" : "hidden"
        } flex items-center justify-center w-full h-screen absolute top-0 left-0 bg-[#c0bfbf60]`}
      >
        <WindowRemoveItem
          items={allItems}
          pId={pId}
          setRemoveItem={setRemoveItem}
          setAllItems={setAllItems}
          setPId={setPId}
          removeItem={removeItem}
        />
      </div>
      {/* view item */}
      <div
        className={`${
          viewAllItems ? "block" : "hidden"
        } flex items-center justify-center w-full h-screen absolute top-0 left-0 bg-[#c0bfbf60] bg-opacity-70`}
      >
        <WindowView
          items={allItems}
          setAllItems={setAllItems}
          setViewAllItems={setViewAllItems}
        />
      </div>
      <div
        className={`flex items-start justify-center w-full h-screen absolute top-0 left-0 bg-[#c0bfbf60] bg-opacity-70 ${
          addPersonCredits ? "block" : "hidden"
        }`}
      >
        <AddPersonCredits
          setAddPersonCredits={setAddPersonCredits}
          allItems={allItems}
          setAllItems={setAllItems}
          apiUrl={apiUrl}
        />
      </div>
    </div>
  );
}

export default Purchase;
