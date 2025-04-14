import React, { useState } from "react";
import Button from "../components/Button";
import Formfield from "../components/Formfield";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const SignUpPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(formData);
  };

  return (
    <div className="w-full h-screen shadow-2xl text-2xl relative text-center py-8 flex flex-col align-center">
      <h2 className="font-semibold">Create account</h2>
      <div className="border border-gray-300 flex flex-col align-center rounded py-4 w-full">
        Enter details below
        <div className="flex flex-col align-center mx-4 text-xl w-full">
          <form
            onSubmit={handleFormSubmit}
            className="px-6 py-4 flex flex-col items-center text-lg capitalize shadow-xl"
          >
            <Formfield
              type="text"
              title="Name"
              placeholder="Name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />

            <Formfield
              type="email"
              title="Email"
              placeholder="example@gmail.com"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />

            <Formfield
              type="password"
              title="Password"
              placeholder="**********"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
            />
            <div className="cursor-pointer">
              <Button name="Create" />
            </div>
          </form>
          <div className="text-[#b2b2b2] w-full">
            <p className="flex align-center">
              Already have an account?
              <Link
                to="/login"
                className="text-[#232323] underline flex align-center"
              >
                Login here
                <ArrowRight />
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
