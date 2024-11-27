import React from "react";
import { Modal, Image, Text, MantineProvider, Flex } from "@mantine/core";

interface ModalWindowProps {
  opened: boolean;
  onClose: () => void;
  title: string;
  description: string;
  link: string;
  model: string;
  screenWidth: number;
  screenHeight: number;
}

const ModalWindow: React.FC<ModalWindowProps> = ({
  opened,
  onClose,
  title,
  description,
  link,
  model,
  screenWidth,
  screenHeight,
}) => {
  return (
    <MantineProvider>
      <Modal
        opened={opened}
        onClose={onClose}
        title={title}
        styles={{
          // modal: {
          //   width: screenWidth * 0.8,
          //   height: screenHeight * 0.8,
          //   alignItems: "center",
          // },
          body: {
            width: "100%",
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          },
        }}
      >
        <Flex direction="column">
          <Text>{description}</Text>
          {model === "image" ? (
            <Image
              src={link}
              alt={title}
              style={{ maxWidth: "100%", maxHeight: "100%" }}
            />
          ) : (
            <video controls style={{ maxWidth: "100%", maxHeight: "100%" }}>
              <source src={link} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          )}
        </Flex>
      </Modal>
    </MantineProvider>
  );
};

export default ModalWindow;
