/**
 * Common Button Component
 * Ví dụ về một common component có thể tái sử dụng
 */

import { Button as AntButton, ButtonProps } from 'antd';
import { FC } from 'react';

interface CustomButtonProps extends ButtonProps {
  // Add custom props here if needed
}

const Button: FC<CustomButtonProps> = (props) => {
  return <AntButton {...props} />;
};

export default Button;
