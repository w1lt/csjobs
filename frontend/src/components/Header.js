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
import { useDisclosure } from "@mantine/hooks";
import { useAuth } from "../context/AuthContext";
import AuthModal from "./AuthModal";
import AccountModal from "./AccountModal";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const { token, logout, login, user } = useAuth();
  const { toggleColorScheme, currentColorScheme } = useColorSchemeToggle();
  const [accountOpened, { open: openAccount, close: closeAccount }] =
    useDisclosure(false);
  const [authOpened, { open: openAuth, close: closeAuth }] =
    useDisclosure(false);
  const navigate = useNavigate();

  return (
    <Flex
      justify="space-between"
      align="center"
      mb="xs"
      style={{ position: "relative" }}
    >
      <Text
        align="center"
        variant="gradient"
        gradient={{ from: "indigo", to: "red", deg: 149 }}
        style={{
          position: "absolute",
          left: "50%",
          transform: "translateX(-50%)",
          fontSize: "2rem",
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
              <Menu.Item onClick={openAccount}>My Account</Menu.Item>
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
              <Menu.Item onClick={() => openAuth()}>Log In</Menu.Item>
              <Menu.Item onClick={() => openAuth()}>Sign Up</Menu.Item>
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
      <AuthModal opened={authOpened} onClose={closeAuth} onLogin={login} />
      <AccountModal opened={accountOpened} onClose={closeAccount} />
    </Flex>
  );
};

export default Header;
