import React from 'react'

type ButtonProps = {
    name: String;
    styles?: String
}

const Button: React.FC<ButtonProps> = ({ name, styles }) => {
  return (
    <div className={`px-6 py-2 mt-2 items-center ${styles || ""}`}>
      <button>{name}</button>
    </div>
  );
}

export default Button