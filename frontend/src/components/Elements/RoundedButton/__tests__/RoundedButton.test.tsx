import React, { FC, ReactElement } from 'react'
import { ThemeProvider } from '@mui/material/styles'
import { render } from '@testing-library/react'
import { RoundedButtonProps, RoundedButton } from '@/components/Elements/RoundedButton'
import theme from '@/lib/theme'

describe('RoundedButton', () => {
  const TestButton: FC<RoundedButtonProps> = (props): ReactElement => <RoundedButton {...props} />

  it('should render text passed to children', () => {
    const component = render(
      <ThemeProvider theme={theme}>
        <TestButton text="test" />
      </ThemeProvider>
    )

    expect(component.queryByText('test')).toBeTruthy()
  })
})
