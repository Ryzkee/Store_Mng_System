import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import axios from "axios";

function DeleteConfirme({
  id,
  setDeleteWindValue,
  setProductsData,
  productsData,
  prodName,
  apiUrl
}) {
  const handleCloseWindow = () => setDeleteWindValue(false);

  //handle delete product
  const handleDeleteProduct = async () => {
    try {
      await axios.delete(`${apiUrl}/delete_product/${id}`);
      setProductsData(productsData.filter((item) => item._id !== id));
      setDeleteWindValue(false);
    } catch (error) {
      alert("Error deleting product");
    }
  };
  return (
    <>
      <Card className={"h-50 p-5"}>
        <CardTitle className={"w-full flex justify-between items-center"}>
          <h1>Deleting Product</h1>
          <button onClick={handleCloseWindow}>
            <X color="red" />
          </button>
        </CardTitle>
        <CardContent className={"w-80"}>
          <p className="pb-5">
            Are you sure you want to delete this product?{" "}
            <span className="italic text-red-500">{prodName}</span>.
          </p>
          <div className="w-full flex justify-between px-5">
            <Button onClick={handleDeleteProduct} className={"bg-red-500"}>
              Delete
            </Button>
            <Button onClick={handleCloseWindow} className={"bg-blue-500"}>
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    </>
  );
}

export default DeleteConfirme;
