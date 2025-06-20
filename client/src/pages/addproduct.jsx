import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getallProducts } from "@/support/helper.js";

function AddProduct() {
  const [barcode, setBarcode] = useState("");
  const [productName, setProductName] = useState("");
  const [investment, setInvestment] = useState("");
  const [profit, setProfit] = useState("");
  const [stockQty, setStockQty] = useState("");
  const [productsData, setProductsData] = useState([]);
  const [existBarcode, setExistBarcode] = useState(false);

  //unitPrice
  const unitPrice = (Number(investment) + Number(profit)).toFixed(2);
  //totaAmount
  const totalAmount = (unitPrice * stockQty).toFixed(2);

  useEffect(() => {
    getallProducts(setProductsData);

    if (barcodeExists) {
      setExistBarcode(true);
      return;
    } else {
      setExistBarcode(false);
    }
  }, [productsData]);

  const barcodeExists = productsData.find(
    (item) => String(item.barcode).trim() === String(barcode).trim()
  );

  const handleAddProduct = async () => {
    const productData = {
      barcode,
      productName,
      investment,
      profit,
      unitPrice,
      stockQty,
      totalAmount,
      addtime: new Date().toISOString(),
      updatetime: new Date().toISOString(),
      status: "available",
    };
    try {
      const response = await fetch("http://localhost:3000/add_product", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productData),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      console.log("Product added successfully:", data);
      // Reset form fields
      setBarcode("");
      setProductName("");
      setInvestment("");
      setProfit("");
      setStockQty("");
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-[85%] mt-[-150px]">
        <CardHeader>
          <CardTitle>Add New Product</CardTitle>
        </CardHeader>
        <p
          className={`w-full text-center ${
            existBarcode ? "block" : "hidden"
          } text-red-500 italic`}
        >
          Barcode is already exist.
        </p>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <Input
              type="number"
              placeholder="BarCode"
              value={barcode}
              onChange={(e) => setBarcode(e.target.value)}
              className={`${barcodeExists ? "border-red-500" : ""}`}
              required
            />
            <Input
              type="text"
              placeholder="Product Name"
              value={productName}
              onChange={(e) => setProductName(e.target.value.toUpperCase())}
              required
            />
            <Input
              type="number"
              placeholder="Investment"
              value={investment}
              onChange={(e) => setInvestment(e.target.value)}
            />
            <Input
              type="number"
              placeholder="Profit"
              value={profit}
              onChange={(e) => setProfit(e.target.value)}
            />
            <Input
              placeholder="Stock Quantity"
              type="number"
              value={stockQty}
              onChange={(e) => setStockQty(e.target.value)}
              required
            />
          </div>
          <Button className="w-full mt-10" onClick={handleAddProduct}>
            Add Product
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

export default AddProduct;
