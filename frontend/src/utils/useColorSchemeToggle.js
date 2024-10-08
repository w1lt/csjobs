// src/hooks/useColorSchemeToggle.js
import { useMantineColorScheme, useComputedColorScheme } from "@mantine/core";

export const useColorSchemeToggle = () => {
  const { setColorScheme } = useMantineColorScheme();
  const computedColorScheme = useComputedColorScheme("dark");

  const toggleColorScheme = () => {
    setColorScheme(computedColorScheme === "dark" ? "light" : "dark");
  };

  return {
    toggleColorScheme,
    currentColorScheme: computedColorScheme,
  };
};
