import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash2, FilePenLine } from "lucide-react";
import { getallProducts } from "@/support/helper";
import DeleteWindow from "../pages/viewlist/delete_product";
import UpdateProduct from "../pages/viewlist/update_product";

function ViewList({ apiUrl }) {
  const [productsData, setProductsData] = useState([]);
  const [search, setSearch] = useState("");
  const [valuePrice, setvaluePrice] = useState("Retail");
  const [deleteWindValue, setDeleteWindValue] = useState(false);
  const [updateWindValue, setUpdateWindValue] = useState(false);
  const [getIdNum, setgetIdNum] = useState("");
  const [prodName, setProdName] = useState("");
  const hidetablesCells = false;

  useEffect(() => {
    getallProducts(setProductsData);
  }, []);

  // calculate if the valuePrice is R, W12, and W10
  useEffect(() => {
    switch (valuePrice) {
      case "Retail":
        setProductsData((prevData) =>
          prevData.map((item) => ({
            ...item,
            unitPrice: (Number(item.investment) + Number(item.profit)).toFixed(
              2
            ),
          }))
        );
        break;
      case "Wholesalex12":
        setProductsData((prevData) =>
          prevData.map((item) => ({
            ...item,
            unitPrice: (
              Number(item.investment) * 12 +
              (Number(item.profit) + 2)
            ).toFixed(2),
          }))
        );
        break;
      case "Wholesalex10":
        setProductsData((prevData) =>
          prevData.map((item) => ({
            ...item,
            unitPrice: (
              Number(item.investment) * 10 +
              (Number(item.profit) + 2)
            ).toFixed(2),
          }))
        );
        break;
    }
  }, [valuePrice]);

  // filter the item
  const filteredProducts = productsData
    .filter(
      (item) =>
        item.productName.toLowerCase().includes(search.toLowerCase()) ||
        item.barcode.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => Number(a.stockQty) - Number(b.stockQty));

  // total the invesmentment
  const totalInvestment = productsData.reduce(
    (acc, item) => acc + Number(item.investment) * Number(item.stockQty),
    0
  );

  // console.log(productsData);
  // console.log(valuePrice);
  // console.log(updateWindValue);
  // console.log(getIdNum);
  return (
    <div className="w-full min-h-screen flex-col justify-center items-center relative">
      <div className="w-full flex justify-between p-4">
        <Input
          type="Search"
          placeholder="Search...."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-[75%]"
        />
        <div className=" flex-col items-center justify-center w-[22%]">
          <Select
            className={"w-full"}
            value={valuePrice}
            onValueChange={setvaluePrice}
          >
            <SelectTrigger className="w-[80px]">
              <SelectValue placeholder="R" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Retail">R</SelectItem>
              <SelectItem value="Wholesalex12">W12</SelectItem>
              <SelectItem value="Wholesalex10">W10</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="w-full px-2 font-bold flex-col justify-between items-center">
        <h1 className="w-full text-center">List of Products</h1>
        <div className="flex-col justify-between w-full">
          <h4 className="text-[10pt] font-light">
            Total Inventment:
            <span className="font-bold">{totalInvestment.toFixed(2)}</span>
          </h4>
          <h4 className="text-[10pt] font-light">
            UnitPrice: <span className="font-bold">{valuePrice}</span>
          </h4>
          <h4 className="text-[10pt] font-light">
            Total Products:{" "}
            <span className="font-bold">{productsData.length}</span>
          </h4>
        </div>
      </div>
      <div className="w-full min-h-screen px-1">
        <Table className={""}>
          <TableHeader>
            {hidetablesCells && (
              <TableHead className={"border border-black"}>BarCode</TableHead>
            )}
            <TableHead className={"border border-black"}>
              Name of Product
            </TableHead>
            <TableHead className={"border text-center border-black"}>
              Stocks
            </TableHead>
            <TableHead className={"border text-center border-black"}>
              UnitPrice
            </TableHead>
            <TableHead className={"border text-center border-black"}>
              Actions
            </TableHead>
          </TableHeader>
          <TableBody>
            {filteredProducts.map((items, index) => {
              return (
                <TableRow
                  key={index}
                  className={`${items.stockQty === 0 ? "bg-red-200" : ""} ${
                    items.stockQty < 3 ? "bg-yellow-200" : ""
                  }`}
                >
                  {hidetablesCells && <TableCell>{items.barcode}</TableCell>}
                  <TableCell
                    className={"overflow-hidden"}
                    title={`
                      PN: ${items.productName}\nBC: ${items.barcode}`}
                  >
                    {items.productName}
                  </TableCell>
                  <TableCell className={"text-center"}>
                    {items.stockQty}
                  </TableCell>
                  <TableCell className={"overflow-hidden"}>
                    ₱ {Number(items.unitPrice).toFixed(2)}
                  </TableCell>
                  <TableCell className={" flex justify-evenly"}>
                    <input type="hidden" value={items.barcode} />
                    <Button
                      className={"bg-red-500 "}
                      onClick={() => {
                        setgetIdNum(items._id);
                        setDeleteWindValue(true);
                        setProdName(items.productName);
                      }}
                    >
                      <Trash2 />
                    </Button>
                    <Button
                      className={"bg-green-500 "}
                      onClick={() => {
                        setUpdateWindValue(true);
                        setgetIdNum(items._id);
                      }}
                    >
                      <FilePenLine />
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
      <div
        className={`w-full h-screen absolute top-0 flex justify-center items-center ${
          deleteWindValue ? "block z-10" : "hidden z-0"
        }`}
      >
        <DeleteWindow
          id={getIdNum}
          setDeleteWindValue={setDeleteWindValue}
          setProductsData={setProductsData}
          productsData={productsData}
          prodName={prodName}
          apiUrl={apiUrl}
        />
      </div>
      <div
        className={`w-full h-screen absolute top-0 flex justify-center items-center ${
          updateWindValue ? "block z-10" : "hidden z-0"
        }`}
      >
        <UpdateProduct
          id={getIdNum}
          setUpdateWindValue={setUpdateWindValue}
          setProductsData={setProductsData}
          productsData={productsData}
          apiUrl={apiUrl}
        />
      </div>
    </div>
  );
}

export default ViewList;
