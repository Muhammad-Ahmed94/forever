import React from "react";

type ButtonProps = {
  name: String;
  styles?: String;
};

const Button: React.FC<ButtonProps> = ({ name, styles }) => {
  return (
    <button
      className={`px-6 py-2 mt-2 items-center bg-auth-color text-white rounded cursor-pointer${
        styles || ""
      }`}
    >
      {name}
    </button>
  );
};

export default Button;
