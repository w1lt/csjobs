import React, { useState, useEffect } from "react";
import {
  Flex,
  Text,
  Box,
  Menu,
  Button,
  Group,
  useMantineTheme,
  SegmentedControl,
} from "@mantine/core";
import {
  IconUserCheck,
  IconUserX,
  IconMenu2,
  IconHelp,
  IconSun,
  IconMoon,
  IconLayout,
  IconChecklist,
  IconSparkles,
} from "@tabler/icons-react";
import { useColorSchemeToggle } from "../utils/useColorSchemeToggle";
import { useAuth } from "../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { modals } from "@mantine/modals";

const Header = () => {
  const { token, logout, user, setLoading } = useAuth();
  const { toggleColorScheme, currentColorScheme } = useColorSchemeToggle();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useMantineTheme();

  const [segmentedValue, setSegmentedValue] = useState(location.pathname);

  const handleSegmentChange = (value) => {
    setSegmentedValue(value);
    setLoading(false);
    setLoading(true);
    setTimeout(() => {
      navigate(value);
    }, 150);
  };

  useEffect(() => {
    setSegmentedValue(location.pathname);
  }, [location.pathname]);

  const openHelpModal = () => {
    modals.openContextModal({
      size: "sm",
      modal: "help",
      title: "Help Center",
    });
  };

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
        background:
          theme.colorScheme === "dark"
            ? "var(--mantine-color-body)"
            : "var(--mantine-color-body)",
        position: "sticky",
        top: 0,
        zIndex: 5,
      }}
      pb={20}
      pt={20}
    >
      <Flex justify="space-between" align="center">
        <Text
          align="center"
          variant="gradient"
          gradient={{ from: "indigo", to: "red", deg: 149 }}
          style={{
            fontSize: "2rem",
            cursor: "pointer",
          }}
          onClick={() => navigate("/")}
        >
          csjobs
        </Text>
        <SegmentedControl
          transitionDuration={100}
          value={segmentedValue}
          onChange={handleSegmentChange}
          data={[
            {
              value: "/listings",
              label: (
                <Flex gap={5} align={"center"}>
                  <IconLayout size={18} />
                  Find Jobs
                </Flex>
              ),
            },
            {
              value: "/applications",
              label: (
                <Flex gap={5} align={"center"}>
                  <IconChecklist size={18} />
                  My Applications
                </Flex>
              ),
            },
            {
              value: "/cover-letter",
              label: (
                <Flex gap={5} align={"center"}>
                  <IconSparkles size={18} />
                  Cover Letter
                </Flex>
              ),
            },
          ]}
        />

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
                {user?.isAdmin && (
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
            <Menu.Item
              leftSection={<IconHelp size={18} />}
              onClick={openHelpModal}
            >
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
