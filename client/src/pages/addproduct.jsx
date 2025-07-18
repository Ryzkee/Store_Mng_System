import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getallProducts } from "@/support/helper.js";
import { X } from "lucide-react";
import axios from "axios";

function AddProduct({ apiUrl }) {
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
  }, []);

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

    if (barcodeExists) {
      setExistBarcode(true);
      alert("Barcode already exists.");
      return;
    }

    try {
      const response = await axios.post(`${apiUrl}/add_product`, productData);
      console.log("Product added successfully:", response.data);

      // Reset form fields
      setBarcode("");
      setProductName("");
      setInvestment("");
      setProfit("");
      setStockQty("");

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      console.log("Product added successfully:", data);
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
              className={`${barcodeExists ? "border-red-500" : ""} ${
                barcode === "" ? "border-red-500" : ""
              }`}
              required
              autoFocus
            />
            <Input
              type="text"
              placeholder="Product Name"
              value={productName}
              onChange={(e) => setProductName(e.target.value.toUpperCase())}
              className={`${productName === "" ? "border-red-500" : ""}`}
              required
            />
            <Input
              type="number"
              placeholder="Investment"
              value={investment}
              onChange={(e) => setInvestment(e.target.value)}
              className={`${investment === "" ? "border-red-500" : ""}`}
              required
            />
            <Input
              type="number"
              placeholder="Profit"
              value={profit}
              onChange={(e) => setProfit(e.target.value)}
              className={`${profit === "" ? "border-red-500" : ""}`}
              required
            />
            <Input
              placeholder="Stock Quantity"
              type="number"
              value={stockQty}
              onChange={(e) => setStockQty(e.target.value)}
              className={`${stockQty === "" ? "border-red-500" : ""}`}
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
