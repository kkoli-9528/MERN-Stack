import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { setIsAuthenticated } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post(
        "http://localhost:3000/api/register",
        { name, email, password },
        { withCredentials: true }
      );
      setIsAuthenticated(true);
      navigate("/login");
    } catch (err: any) {
      alert(err.response?.data?.error || "Registration failed");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <Card className="w-96">
        <CardHeader>
          <CardTitle>Register</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="flex flex-col gap-4">
            <Input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </CardContent>
          <CardFooter style={{paddingTop: "20px"}}>
            <Button type="submit" className="w-full">Register</Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
