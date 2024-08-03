import React from "react";
import { Container, Box, Text, Button, useMantineTheme } from "@mantine/core";
import { useNavigate } from "react-router-dom";
import { motion, useAnimation } from "framer-motion";

const reviews = [
  "I found my dream internship through csjobs.lol! The platform is amazing.",
  "The job listings are always up-to-date and relevant. Highly recommended.",
  "Thanks to csjobs.lol, I landed an internship at a top company!",
  "csjobs.lol has the best listings for internships and jobs. Absolutely love it!",
  "The user interface is so clean and easy to use. Found my internship in no time!",
];

const duplicatedReviews = [...reviews, ...reviews];

const SplashPage = () => {
  const theme = useMantineTheme();
  const navigate = useNavigate();
  const controls = useAnimation();
  const containerControls = useAnimation();

  const handleGetStarted = () => {
    containerControls
      .start({
        opacity: 0,
        scale: 0.8,
        transition: { duration: 0.5 },
      })
      .then(() => {
        navigate("/listings"); // Adjust this to the actual route for your homepage
      });
  };

  React.useEffect(() => {
    controls.start({
      x: [0, -300 * reviews.length],
      transition: {
        x: {
          repeat: Infinity,
          repeatType: "loop",
          duration: 30,
          ease: "linear",
        },
      },
    });
  }, [controls]);

  return (
    <motion.div
      initial={{ opacity: 1, scale: 1 }}
      animate={containerControls}
      style={{
        position: "relative",
        minHeight: "100vh",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: theme.spacing.xl,
        background:
          "linear-gradient(270deg, #00c6ff, #0072ff, #ff00c8, #ff6600)",
        backgroundSize: "800% 800%",
        animation: "gradient 15s ease infinite",
      }}
    >
      <style>
        {`
          @keyframes gradient {
            0% {
              background-position: 0% 50%;
            }
            50% {
              background-position: 100% 50%;
            }
            100% {
              background-position: 0% 50%;
            }
          }
          .scroll-container {
            display: flex;
            overflow: hidden;
            white-space: nowrap;
          }
          .review {
            flex: 0 0 auto;
            margin: 0 1rem;
            padding: 1rem;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 8px;
            backdrop-filter: blur(10px);
            display: inline-block;
            min-width: 300px;
          }
        `}
      </style>
      <Container
        size="sm"
        style={{ textAlign: "center", color: theme.white, zIndex: 1 }}
        component={motion.div}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
      >
        <Text
          size="xl"
          weight={700}
          style={{ marginBottom: theme.spacing.md }}
          component={motion.h1}
          initial={{ y: -50 }}
          animate={{ y: 0 }}
          transition={{ type: "spring", stiffness: 100 }}
        >
          Welcome to csjobs.lol
        </Text>
        <Text
          size="lg"
          style={{ marginBottom: theme.spacing.md }}
          component={motion.p}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
        >
          Your one-stop platform for securing the best internships and job
          opportunities.
        </Text>
        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
          <Button
            size="lg"
            radius="xl"
            variant="filled"
            style={{ backgroundColor: theme.colors.teal[6] }}
            onClick={handleGetStarted}
          >
            Start Applying for Free!
          </Button>
        </motion.div>
      </Container>
      <Container
        size="md"
        style={{
          textAlign: "center",
          color: theme.white,
          zIndex: 1,
          marginTop: theme.spacing.xl,
        }}
        component={motion.div}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
      >
        <Text size="lg" weight={500} style={{ marginBottom: theme.spacing.md }}>
          Trusted by students and professionals alike
        </Text>
        <Box style={{ overflow: "hidden", width: "100%" }}>
          <motion.div
            className="scroll-container"
            animate={controls}
            style={{ display: "flex", width: "fit-content" }}
          >
            {duplicatedReviews.map((review, index) => (
              <Box key={index} className="review">
                <Text size="md">{review}</Text>
              </Box>
            ))}
          </motion.div>
        </Box>
      </Container>
    </motion.div>
  );
};

export default SplashPage;
