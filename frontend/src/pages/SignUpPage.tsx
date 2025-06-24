import { ArrowRight } from "lucide-react";
import React, { useState } from "react";
import { Link } from "react-router-dom";
// import Button from "../components/Button";
import Formfield from "../components/Formfield";
import useUserStore from "../stores/useUserStore";

const SignUpPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const { signup, loading } = useUserStore();

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    signup(
      formData.name,
      formData.email,
      formData.password,
      formData.confirmPassword,
    );
  };

  return (
    <div className="w-full min-h-screen shadow-2xl text-xl relative text-center py-8 flex flex-col items-center justify-center">
      <div className="max-w-md w-full mx-auto px-4">
        <h2 className="font-semibold text-2xl mb-6">Create account</h2>
        
        <div className="border border-gray-300 flex flex-col align-center rounded py-6 px-4 bg-white">
          <p className="text-gray-600 mb-4">Enter details below</p>
          
          <form
            onSubmit={handleFormSubmit}
            className="w-full max-w-sm space-y-4 "
          >
            <Formfield
              type="text"
              title="Name"
              placeholder="Name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full"
            />

            <Formfield
              type="email"
              title="Email"
              placeholder="example@gmail.com"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="w-full"
            />

            <Formfield
              type="password"
              title="Password"
              placeholder="**********"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              className="w-full"
            />

            <Formfield
              type="password"
              title="Confirm Password"
              placeholder="**********"
              value={formData.confirmPassword}
              onChange={(e) =>
                setFormData({ ...formData, confirmPassword: e.target.value })
              }
              className="w-full"
            />
            
            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full px-6 py-3 bg-auth-color text-white rounded cursor-pointer font-medium hover:bg-opacity-90 disabled:opacity-50"
              >
                {loading ? "Creating..." : "Create Account"}
              </button>
            </div>
          </form>
          
          <div className="text-gray-500 w-full mt-6 text-center">
            <p className="flex items-center justify-center gap-1">
              Already have an account?
              <Link
                to="/login"
                className="text-auth-color underline flex items-center gap-1 hover:no-underline"
              >
                Login here
                <ArrowRight size={16} />
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
