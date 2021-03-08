import React, { useState } from 'react';
import { Collapse, Navbar, NavbarToggler, NavbarBrand, Nav, NavItem, NavLink } from 'reactstrap';

interface MainNavbarProps {
  onStatsClick: () => void;
  onSettingsClick: () => void;
};

export const MainNavbar: React.FC<MainNavbarProps> = (props: MainNavbarProps) => {
  const [collapsed, setCollapsed] = useState(true);

  const toggleNavbar = () => setCollapsed(!collapsed);

  return (
    <div>
      <Navbar color="light" light>
        <NavbarBrand href="/" className="mr-auto">Minesweeper</NavbarBrand>
        <NavbarToggler onClick={toggleNavbar} className="mr-2" />
        <Collapse isOpen={!collapsed} navbar>
          <Nav navbar>
            <NavItem>
              <NavLink onClick={props.onStatsClick}>Statistic</NavLink>
            </NavItem>
            <NavItem>
              <NavLink onClick={props.onSettingsClick}>Settings</NavLink>
            </NavItem>
          </Nav>
        </Collapse>
      </Navbar>
    </div>
  );
}
