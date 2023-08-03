import { FC, ReactNode, useState } from 'react'
import { styled } from '@mui/material/styles'
import * as React from 'react'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import Menu from '@mui/material/Menu'
import Container from '@mui/material/Container'
import Button, { ButtonProps } from '@mui/material/Button'
import MenuItem from '@mui/material/MenuItem'
import { RoundedButton } from '@/components/Elements/RoundedButton'

enum Routes {
  home = 'Home',
  campgrounds = 'Campgrounds'
}
const routes = [Routes.home, Routes.campgrounds]
const settings = ['Profile', 'Account', 'Logout']

type NavRouteType = ButtonProps & {
  isSelected?: boolean
}

const NavItem = styled(Button)<NavRouteType>(({ theme, isSelected }) => ({
  color: isSelected ? theme.customColors.aquamarine : theme.customColors.white,
  fontSize: 16,
  fontWeight: 700,
  letterSpacing: 2.4,
  textTransform: 'uppercase',
  padding: 0,
  minWidth: 'max-content',
  '&:hover': {
    color: theme.palette.secondary.main,
    backgroundColor: 'transparent'
  }
}))

const ResponsiveAppBar = () => {
  const [selectedRoute, setSelectedRoute] = useState<Routes>(Routes.home)
  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null)
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null)

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget)
  }
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget)
  }

  const handleCloseNavMenu = () => {
    setAnchorElNav(null)
  }

  const handleCloseUserMenu = () => {
    setAnchorElUser(null)
  }

  const handleNavItemClick = (value: Routes) => setSelectedRoute(value)

  return (
    <AppBar position="static" sx={{ alignItems: 'center', backgroundColor: { md: 'transparent' } }}>
      <Container maxWidth="xl" sx={{ height: '120px', marginX: 0, paddingX: { xl: '150px' } }}>
        <Toolbar
          disableGutters
          sx={{
            height: '100%',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left'
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left'
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' }
              }}>
              {routes.map((page) => (
                <MenuItem key={page} onClick={handleCloseNavMenu}>
                  <Typography textAlign="center">{page}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>

          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, justifyContent: 'space-between' }}>
            <Box display={'flex'} columnGap={2}>
              {routes.map((page) => (
                <NavItem key={page} disableRipple isSelected={page === selectedRoute} onClick={() => handleNavItemClick(page)}>
                  {page}
                </NavItem>
              ))}
            </Box>
            <Box>
              <RoundedButton text={'Login'} />
            </Box>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  )
}

export const MainLayout: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <div>
      <ResponsiveAppBar />
      {children}
    </div>
  )
}
