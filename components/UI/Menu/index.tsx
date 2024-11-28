import { useState } from "react";
import Link from "next/link";
import {HamburgerMenuIcon} from "@radix-ui/react-icons";
import {Container, Flex} from "@mantine/core";


const menuItems = [
  {
    title: 'Home',
    link: '/'
  },
  {
    title: 'About',
    link: '/about'
  },
  {
    title: 'Map',
    link: '/chicago'
  }
];

export default function MainMenu() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div>
      <button
        onClick={toggleMenu}
        style={{
          position: "fixed",
          top: "10px",
          left: "10px",
          zIndex: 1000,
          padding: "16px",
          backgroundColor: "#333",
          color: "#fff",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer"
        }}
      >
        <HamburgerMenuIcon />
      </button>
      {isMenuOpen && (
        <Container
          style={{
            position: "fixed",
            top: "80px",
            left: "10px",
            zIndex: 999, backgroundColor: "rgba(255, 255, 255, 0.7)",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            borderRadius: "5px",
            padding: "10px"
          }}
        >
          <Flex direction="column">
              {menuItems.map((item) => (
                  <Container key={item.link}
                    style={{
                        padding: "10px",
                        width: "100px",
                        textAlign: "center",
                    }}
                  >
                      <Link
                          style={{
                            color: "#0085b8",
                              fontSize: "24px"
                          }}
                          href={item.link}
                      >
                          {item.title}
                      </Link>
                  </Container>
              ))}
          </Flex>
        </Container>
      )}
    </div>
  );
}