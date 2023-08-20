'use client'
import React, { type FC } from 'react'
import Button, { ButtonProps } from '@mui/material/Button'
import { SystemStyleObject } from '@mui/system/styleFunctionSx/styleFunctionSx'
import { useTheme } from '@mui/material/styles'

export type RoundedButtonProps = ButtonProps & {
  text: string
  styles?: SystemStyleObject
}
export const RoundedButton: FC<RoundedButtonProps> = ({ text, styles }) => {
  const theme = useTheme()

  return (
    <Button
      color={'secondary'}
      variant={'contained'}
      sx={{
        width: 140,
        height: 50,
        borderRadius: '48px',
        background: theme.palette.secondary.main,
        boxShadow: '5px 15px 40px 0px rgba(0, 201, 224, 0.20)',
        color: theme.customColors.white,
        fontSize: 16,
        fontWeight: 700,
        letterSpacing: '1.6px',
        textTransform: 'uppercase',
        ...styles
      }}>
      {text}
    </Button>
  )
}
