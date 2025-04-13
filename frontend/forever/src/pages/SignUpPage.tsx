import React, { useState } from "react";
import Button from "../components/Button";
import Formfield from "../components/Formfield";

type SignUpPageProps = {};

const SignUpPage = (props: SignUpPageProps) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(formData);
  };

/*   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
 */
  return (
    <div className="capitalize font-light shadow-2xl relative text-center py-8 flex flex-col items-center">
      <h2>create an account</h2>
      <div className="w-1/2 border border-gray-300 flex flex-col align-center rounded py-4">
        enter details below
        <div className="flex flex-col justify-start items-start mx-4">
          <form
            onSubmit={handleFormSubmit}
            className="w-full px-6 flex flex-col items-center"
          >
            <Formfield
              type="text"
              title="Name"
              placeholder="Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value})}
            />

            <Formfield
              type="email"
              title="Email"
              placeholder="example@gmail.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value})}
            />

            <Formfield
              type="password"
              title="Password"
              placeholder="*******"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value})}
            />
        <div className="">
          <Button name="Create" styles="bg-blue-600 text-white font-semibold rounded " />
        </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
