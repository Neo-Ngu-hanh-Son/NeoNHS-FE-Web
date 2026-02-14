import React from 'react'
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip'

type Props = {
  children: React.ReactNode;
  content: string;
}

/**
 * TooltipWrapper
 * A wrapper component for Tooltip from shadcn/ui. Please wrap this in TooltipProvider first
 * 
 * @param {React.ReactNode} children - The content to be wrapped in TooltipTrigger.
 * @param {string} content - The content to be displayed in TooltipContent.
 * @returns {JSX.Element} - The TooltipWrapper component.
 */
export default function TooltipWrapper({ children, content }: Props) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        {children}
      </TooltipTrigger>
      <TooltipContent>{content}</TooltipContent>
    </Tooltip>
  )
}