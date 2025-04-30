import React from "react";

type FormfeildProps = {
  title: string;
  placeholder?: string;
  type: string;
  value?: string;
  accept?: string;
  className?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const Formfield: React.FC<FormfeildProps> = ({
  title,
  placeholder,
  type,
  value,
  accept,
  className,
  onChange,
}) => {
  return (
    <div className={`my-2 flex flex-col items-start ${className}`}>
      <label className="mb-1">{title}</label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        accept={accept}
        onChange={onChange}
        className="border border-gray-400 rounded px-2 py-2"
        required
      />
    </div>
  );
};

export default Formfield;
