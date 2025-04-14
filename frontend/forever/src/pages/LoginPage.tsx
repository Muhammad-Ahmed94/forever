import React, { useState } from "react";
import Button from "../components/Button";
import Formfield from "../components/Formfield";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(`email:${email} \n password:${password}`);
  };

  return (
    <div className="w-full h-screen shadow-2xl text-2xl relative text-center py-8 flex flex-col align-center">
      <h2 className="font-semibold">Login below</h2>
      <div className="flex flex-col align-center mx-4 text-xl w-full">
        <form
          onSubmit={handleFormSubmit}
          className="px-6 py-4 flex flex-col items-center text-lg capitalize shadow-xl rounded"
        >
          <Formfield
            type="email"
            title="Email"
            placeholder="example@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <Formfield
            type="password"
            title="Password"
            placeholder="**********"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <div className="cursor-pointer">
            <Button name="Login" />
          </div>
        </form>
        <div className="text-[#b2b2b2] w-full">
          <p className="flex align-center">
            Not a member?
            <Link
              to="/signup"
              className="text-[#232323] underline flex align-center"
            >
              Signup now
              <ArrowRight />
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
