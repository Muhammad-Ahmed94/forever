import React from 'react'

type ButtonProps = {
    name: String;
    styles?: String
}

const Button: React.FC<ButtonProps> = ({ name, styles }) => {
  return (
    <div className={`border border-gray-300 px-4 pt-2 items-center cursor-pointer ${styles || ''}`}>
        <button>{name}</button>
    </div>
  )
}

export default Button