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
      <label className="mb-1 text-sm font-medium">{title}</label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        accept={accept}
        onChange={onChange}
        className="w-full border border-gray-400 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-auth-color focus:border-transparent"
        required
      />
    </div>
  );
};

export default Formfield;
