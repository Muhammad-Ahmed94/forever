import React from "react";

type FormfeildProps = {
  title: string;
  placeholder: string;
  type: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const Formfield: React.FC<FormfeildProps> = ({title, placeholder, type, value, onChange}) => {
  return (
    <div className="my-2 flex flex-col items-start">
      <h3 className="mb-1">{title}</h3>
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className="border border-gray-400 rounded px-2 py-2"
        />
    </div>
  );
}

export default Formfield