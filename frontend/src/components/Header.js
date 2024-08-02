import React from "react";
import { Flex, Text, Box, Menu, Button, Group } from "@mantine/core";
import {
  IconUserCheck,
  IconUserX,
  IconMenu2,
  IconHelp,
  IconSun,
  IconMoon,
} from "@tabler/icons-react";
import { useColorSchemeToggle } from "../utils/useColorSchemeToggle";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { modals } from "@mantine/modals";

const Header = () => {
  const { token, logout, user } = useAuth();
  const { toggleColorScheme, currentColorScheme } = useColorSchemeToggle();
  const navigate = useNavigate();

  const openAuthModal = () => {
    modals.openContextModal({
      size: "sm",
      modal: "auth",
      title: "Authentication",
    });
  };

  const openAccountModal = () => {
    modals.openContextModal({
      modal: "account",
      title: "Account",
    });
  };

  return (
    <Box
      style={{
        top: 0,
        zIndex: 1000,
      }}
    >
      <Flex justify="space-between" align="center" mb="xs" mt="md">
        <Text
          align="center"
          variant="gradient"
          gradient={{ from: "indigo", to: "red", deg: 149 }}
          style={{
            position: "absolute",
            left: "50%",
            transform: "translateX(-50%)",
            fontSize: "2rem",
            cursor: "pointer",
          }}
          onClick={() => navigate("/")}
        >
          csjobs.lol
        </Text>
        <Box />
        <Menu
          position="bottom-end"
          withArrow
          trigger="click-hover"
          openDelay={25}
          closeDelay={100}
          width={200}
        >
          <Menu.Target>
            <Button variant="outline" radius={"lg"}>
              <Group gap={"xs"}>
                {token ? <IconUserCheck /> : <IconUserX size={24} />}
                <IconMenu2 />
              </Group>
            </Button>
          </Menu.Target>
          <Menu.Dropdown>
            {token ? (
              <>
                <Menu.Label>Account</Menu.Label>
                <Menu.Item onClick={openAccountModal}>My Account</Menu.Item>
                {user.isAdmin && (
                  <Menu.Item onClick={() => navigate("/admin")}>
                    Admin Page
                  </Menu.Item>
                )}
                <Menu.Item c={"red"} onClick={() => logout()}>
                  Log Out
                </Menu.Item>
              </>
            ) : (
              <>
                <Menu.Label>Not logged in</Menu.Label>
                <Menu.Item onClick={openAuthModal}>Log In</Menu.Item>
              </>
            )}
            <Menu.Divider />
            <Menu.Item leftSection={<IconHelp size={18} />}>
              Help Center
            </Menu.Item>
            <Menu.Item
              leftSection={
                currentColorScheme === "dark" ? (
                  <IconSun size={18} />
                ) : (
                  <IconMoon size={18} />
                )
              }
              onClick={toggleColorScheme}
            >
              Change Theme
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </Flex>
    </Box>
  );
};

export default Header;
