import React from 'react'

type ButtonProps = {
    name: String;
    styles?: String
}

const Button: React.FC<ButtonProps> = ({ name, styles }) => {
  return (
    <div className={['py-2 px-4', styles]}>
        {name}
    </div>
  )
}

export default Button