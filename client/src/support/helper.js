import axios from "axios";

export const getUsername = async (setUsers) => {
  try {
    await axios
      .get("http://localhost:3000/get/username")
      .then((response) => setUsers(response.data))
      .catch((error) => console.error("Error fetching username:", error));
  } catch (error) {
    console.error("Error in getUsername:", error);
  }
};

export const getallProducts = async (setProductsData) => {
  try {
    await axios
      .get("http://localhost:3000/get/products")
      .then((response) => setProductsData(response.data))
      .catch((error) => console.error("Error fetching products:", error));
  } catch (error) {
    console.error("Error in getallProducts:", error);
  }
};

export const getSales = async (setSalesData) => {
  try {
    await axios
      .get("http://localhost:3000/get/orders")
      .then((response) => setSalesData(response.data))
      .catch((error) => console.error("Error fetching sales data:", error));
  } catch (error) {
    console.error("Error in getSales:", error);
  }
};

export const getCredits = async (setCreditsList) => {
  try {
    await axios
      .get("http://localhost:3000/get/creditsList")
      .then((response) => setCreditsList(response.data))
      .catch((error) => console.error("Error fetching products:", error));
  } catch (error) {
    console.error("Error in getCredits", error);
  }
};
