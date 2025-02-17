import { useState } from "react";
import Link from "next/link";
import {HamburgerMenuIcon} from "@radix-ui/react-icons";
import {Container, Flex} from "@mantine/core";


const menuItems = [
  {
    title: 'Home',
    link: '/',
      left: "10px",
  },
  {
    title: 'Map',
    link: '/chicago',
      left: "50px",
  },
    {
        title: 'About',
        link: '/about',
        left: "15px",
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
          zIndex: 999,
          padding: "0px",
          background: "none",
          color: "#fff",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer"
        }}
      >
        <img src="/UI/menu.png" alt="menu" width={50}/>
      </button>
      {isMenuOpen && (
        <Container
          style={{
            position: "fixed",
            top: "60px",
            left: "40px",
            zIndex: 999, backgroundImage: "url('/UI/menu_2.png')",
            backgroundSize: "cover",
            padding: "0px",
              height: "230px",
                width: "150px",
              overflowBlock: "visible",
          }}
        >
          <Flex direction="column">
              {menuItems.map((item) => (
                  <Container key={item.link}
                    style={{
                        padding: "12px",
                        // width: "100px",
                        textAlign: "center",
                        fontWeight: 900,
                        fontSize: "24px",
                        paddingLeft: item.left,
                        cursorType: "pointer",
                    }}
                  >
                      <Link
                          style={{
                            color: "#d4d3d6",
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