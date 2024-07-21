'use client'
import React, { type FC, type ReactNode, useState, type MouseEvent } from 'react'
import { alpha, styled, useTheme } from '@mui/material/styles'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import Menu from '@mui/material/Menu'
import Container from '@mui/material/Container'
import Button, { type ButtonProps } from '@mui/material/Button'
import MenuItem from '@mui/material/MenuItem'
import { RoundedButton } from '@/components/Elements/RoundedButton'
import { Divider, Drawer, IconButton, List, ListItem, ListItemButton, ListItemText } from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'

enum Routes {
  home = 'Home',
  campgrounds = 'Campgrounds'
}
const routes = [Routes.home, Routes.campgrounds]
const settings = ['Profile', 'Account', 'Logout']

type NavRouteType = ButtonProps & {
  isSelected?: boolean
}

const NavItem = styled(Button, { shouldForwardProp: (propName) => propName !== 'isSelected' })<NavRouteType>(({ theme, isSelected }) => ({
  color: isSelected ? theme.customColors.aquamarine : theme.customColors.white,
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

interface Props {
  window?: () => Window
}

const ResponsiveAppBar = (props: Props) => {
  const [selectedRoute, setSelectedRoute] = useState<Routes>(Routes.home)
  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null)
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null)
  const theme = useTheme()
  const [mobileOpen, setMobileOpen] = React.useState(false)

  const { window } = props

  const container = window !== undefined ? () => window().document.body : undefined

  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState)
  }

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

  const handleNavItemClick = (value: Routes, e?: MouseEvent<HTMLLIElement>) => {
    if (e) e.stopPropagation()
    setSelectedRoute(value)
  }

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center', paddingX: { xs: 1, sm: 2 } }}>
      <Box display={'flex'} justifyContent={'center'}>
        <Typography variant="h6" color={theme.customColors.white} sx={{ my: 2 }}>
          OutdooReview
        </Typography>
      </Box>
      <Divider />
      <List>
        {routes.map((item) => (
          <ListItem key={item} disablePadding onClick={(e) => handleNavItemClick(item, e)}>
            <ListItemButton sx={{ textAlign: 'center' }}>
              <ListItemText primary={item} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  )

  return (
    <>
      <AppBar
        component={'nav'}
        sx={{
          alignItems: 'center',
          boxShadow: { md: 'unset' },
          backgroundColor: { xs: alpha(theme.palette.primary.main, 0.4), md: 'transparent' }
        }}>
        <Container
          maxWidth="xl"
          sx={{
            height: { xs: 80, md: 120 },
            position: { xs: 'sticky', md: 'absolute' },
            marginX: 0,
            paddingX: { md: 12, lg: 13, xl: 15 }
          }}>
          <Toolbar
            disableGutters
            sx={{
              height: '100%',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
            <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
              <IconButton size="large" aria-label="menu" aria-controls="menu-appbar" aria-haspopup="true" onClick={handleDrawerToggle} color="inherit">
                <MenuIcon />
              </IconButton>
            </Box>

            <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, justifyContent: 'space-between' }}>
              <Box display={'flex'} columnGap={2}>
                {routes.map((page) => (
                  <NavItem
                    key={page}
                    disableRipple
                    isSelected={page === selectedRoute}
                    onClick={() => handleNavItemClick(page)}
                    sx={{ fontSize: { md: 14, xl: 16 } }}>
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

      <nav>
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: '100%',
              background: 'linear-gradient(0deg, hsla(172, 92%, 14%, 1) 0%, hsla(173, 100%, 33%, 1) 100%)'
            }
          }}>
          {drawer}
        </Drawer>
      </nav>
    </>
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
