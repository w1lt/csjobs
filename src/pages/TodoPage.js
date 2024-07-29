import React from "react";
import { Container, Title, List, ListItem } from "@mantine/core";

const TodoPage = () => {
  const todoItems = [
    {
      category: "Backend",
      items: [
        "report listing button",
        "rate the ease of application",
        "save listings",
      ],
    },
    { category: "Frontend", items: ["none"] },
  ];

  return (
    <Container size="sm">
      <List>
        {todoItems.map((section, index) => (
          <ListItem key={index}>
            <Title order={4}>{section.category}</Title>
            <List withPadding>
              {section.items.map((item, idx) => (
                <ListItem key={idx}>{item}</ListItem>
              ))}
            </List>
          </ListItem>
        ))}
      </List>
    </Container>
  );
};

export default TodoPage;
