import React, { useState } from "react";
import { useUser } from "../lib/customHooks";
import { Link } from "react-router-dom";
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
} from "reactstrap";

const AppNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, authenticated } = useUser();
  const toggle = () => setIsOpen(!isOpen);

  return (
    <div>
      <Navbar color="dark" dark expand="md">
        <NavbarBrand href="/" aria-label="Home">
          Takvim Uygulaması
        </NavbarBrand>
        <NavbarToggler onClick={toggle} aria-label="Toggle navigation" />
        <Collapse isOpen={isOpen} navbar>
          <Nav className="ml-auto" navbar>
            {!authenticated && (
              <NavItem>
                <Link
                  to="/calendar/"
                  className="nav-link"
                  aria-label="Calendar"
                >
                  Takvim
                </Link>
              </NavItem>
            )}

            {!authenticated && (
              <NavItem>
                <Link to="/signin/" className="nav-link" aria-label="Sign In">
                  Oturum Aç
                </Link>
              </NavItem>
            )}

            {authenticated && (
              <NavItem>
                <a href="/logout/" className="nav-link" aria-label="Log Out">
                  Çıkış Yap
                </a>
              </NavItem>
            )}
          </Nav>
        </Collapse>
      </Navbar>
    </div>
  );
};

export default AppNavbar;
