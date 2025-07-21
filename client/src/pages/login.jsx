import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import axios from "axios";

function Login({ users, apiUrl }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorLoginUname, setErrorLoginUname] = useState(false);
  const [errorLoginPass, setErrorLoginPass] = useState(false);

  useEffect(() => {}, [username, password, users]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${apiUrl}/login`, {
        username,
        password,
      });
      if (res.data.success) {
        localStorage.setItem("token", res.data.token); // Save token
        window.location.href = "/dashboard";
      } else {
        //alert("Invalid username or password");
        const checkUsername = users.find((user) => user.username === username);
        setErrorLoginUname(username !== "" && !checkUsername);

        // Only check password if username is valid
        if (checkUsername) {
          setErrorLoginPass(
            password !== "" && checkUsername.password !== password
          );
        } else {
          setErrorLoginPass(false);
        }
      }
    } catch (error) {
      alert("Login failed. Please try again.", error);
    }
  };

  return (
    <div className="w-full h-screen flex-col items-center justify-center">
      <h1 className="w-full h-30 flex items-end justify-center text-[30pt] font-bold">
        Daz Store
      </h1>
      <p
        className={`${
          errorLoginUname ? "block" : "hidden"
        } w-full text-center text-red-400`}
      >
        Invalid Username
      </p>
      <p
        className={`${
          errorLoginPass ? "block" : "hidden"
        } w-full text-center text-red-400`}
      >
        Invalid Password
      </p>
      <Card className="w-[90%] mx-auto mt-15">
        <CardHeader>
          <CardTitle>Login</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Username
              </label>
              <Input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className={`${errorLoginUname ? "border-red-500" : ""}`}
                required
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`${errorLoginPass ? "border-red-500" : ""}`}
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
            >
              Login
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default Login;
