import { useEffect, useState } from "react";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import axios from "axios";

function UpdateProduct({
  id,
  setUpdateWindValue,
  setProductsData,
  productsData,
}) {
  const handleCloseWindow = () => setUpdateWindValue(false);
  const [closeWindow, setCloseWindow] = useState(false);
  const [barcode, setBarcode] = useState("");
  const [productName, setProductName] = useState("");
  const [investment, setInvestment] = useState("");
  const [profit, setProfit] = useState("");
  const [stockQty, setStockQty] = useState("");

  useEffect(() => {
    const item = productsData.find((item) => item._id === id);
    if (item) {
      setBarcode(item.barcode);
      setProductName(item.productName);
      setInvestment(item.investment);
      setProfit(item.profit);
      setStockQty(item.stockQty);
    }
  }, [id, productsData]);

  const handleUpdateProduct = async () => {
    try {
      const response = await axios.put(
        `http://localhost:3000/update/product/${id}`,
        {
          barcode,
          productName,
          investment,
          profit,
          stockQty,
        }
      );
      if (response.status === 200) {
        // Update the productsData state with the updated product
        const updatedProduct = response.data;
        setProductsData((prevProducts) =>
          prevProducts.map((product) =>
            product._id === id ? updatedProduct : product
          )
        );
        setCloseWindow(true);
        
        setTimeout(() => {
          setCloseWindow(false);
        }, 2000); // Close the window after 2 seconds

        setTimeout(() => {
          setUpdateWindValue(false);
        }, 3000); // Close the update window after 3 seconds
      }
    } catch (error) {
      console.error("Error updating product:", error);
      // Optionally, you can show an error message to the user
    }
  };

  //console.log(productsData)
  return (
    <>
      <Card className={"h-auto p-5 relative "}>
        <CardTitle className={"w-full flex justify-between items-center"}>
          <h1>Upadate Product</h1>
          <button onClick={handleCloseWindow}>
            <X color="red" />
          </button>
        </CardTitle>
        <CardContent className={"w-80"}>
          <div className="grid grid-cols-1 gap-4 text-[15pt]">
            <label htmlFor="">Barcode</label>
            <Input
              type="number"
              placeholder="BarCode"
              value={barcode}
              onChange={(e) => setBarcode(e.target.value)}
              required
            />
            <label htmlFor="">Product Name</label>
            <Input
              type="text"
              placeholder="Product Name"
              value={productName}
              onChange={(e) => setProductName(e.target.value.toUpperCase())}
              required
            />
            <label htmlFor="">Investment</label>
            <Input
              type="number"
              placeholder="Investment"
              value={investment}
              onChange={(e) => setInvestment(e.target.value)}
            />
            <label htmlFor="">Profit</label>
            <Input
              type="number"
              placeholder="Profit"
              value={profit}
              onChange={(e) => setProfit(e.target.value)}
            />
            <label htmlFor="">Stock Quantity</label>
            <Input
              placeholder="Stock Quantity"
              type="number"
              value={stockQty}
              onChange={(e) => setStockQty(e.target.value)}
              required
            />
          </div>
          <Button className="w-full mt-10" onClick={handleUpdateProduct}>
            Update Product
          </Button>
        </CardContent>
        <Card
          className={`absolute top-40 w-[80%] flex self-center justify-center items-center ${
            closeWindow ? "block" : "hidden"
          }`}
        >
          <p className="w-full text-center">Product updated successfully</p>
        </Card>
      </Card>
    </>
  );
}

export default UpdateProduct;
