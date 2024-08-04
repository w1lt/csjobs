import React, { useEffect, useState } from "react";
import {
  Container,
  Box,
  Text,
  Button,
  useMantineTheme,
  Center,
  useComputedColorScheme,
} from "@mantine/core";
import { useNavigate } from "react-router-dom";
import { motion, useAnimation } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";

const companyLogos = [
  "https://www.svgrepo.com/show/303183/google-2015-logo.svg",
  "https://www.svgrepo.com/show/508761/apple.svg",
  "https://www.svgrepo.com/show/424916/meta-logo-facebook.svg",
  "https://www.svgrepo.com/show/303143/microsoft-logo.svg",
  "https://www.svgrepo.com/show/303630/nvidia-logo.svg",
];

const duplicatedLogos = [
  ...companyLogos,
  ...companyLogos,
  ...companyLogos,
  ...companyLogos,
];

const SplashPage = () => {
  const theme = useMantineTheme();
  const navigate = useNavigate();
  const controls = useAnimation();
  const containerControls = useAnimation();
  const { token } = useAuth();
  const [init, setInit] = useState(false);
  const colorScheme = useComputedColorScheme();

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  const handleGetStarted = () => {
    containerControls
      .start({
        opacity: 0,
        transition: { duration: 0.25 },
      })
      .then(() => {
        navigate("/listings");
      });
  };

  useEffect(() => {
    if (token) {
      navigate("/listings");
    }

    const logoWidth = 150; // Adjust according to the actual width of the logo
    const totalLogosWidth = duplicatedLogos.length * logoWidth;

    controls.start({
      x: [0, -totalLogosWidth / 2],
      transition: {
        x: {
          repeat: Infinity,
          repeatType: "loop",
          duration: 30,
          ease: "linear",
        },
      },
    });
  }, [controls, navigate, token]);

  const particlesLoaded = (container) => {
    console.log(container);
  };

  return (
    init && (
      <motion.div
        initial={{ opacity: 1 }}
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
        }}
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
          }}
        >
          <Particles
            id="tsparticles"
            particlesLoaded={particlesLoaded}
            options={{
              fpsLimit: 120,
              interactivity: {
                events: {
                  onClick: {
                    enable: false,
                    mode: "push",
                  },
                  onHover: {
                    enable: false,
                    mode: "repulse",
                  },
                  resize: true,
                },
                modes: {
                  push: {
                    quantity: 4,
                  },
                  repulse: {
                    distance: 200,
                    duration: 0.4,
                  },
                },
              },
              particles: {
                color: {
                  value: colorScheme === "dark" ? "#ffffff" : "#000000",
                },
                opacity: {
                  value: 0.5,
                },
                links: {
                  color: colorScheme === "dark" ? "#ffffff" : "#000000",
                  distance: 150,
                  enable: true,
                  opacity: 0.2,
                  width: 1,
                },
                move: {
                  direction: "none",
                  enable: true,
                  outModes: {
                    default: "bounce",
                  },
                  random: false,
                  speed: 0.25,
                  straight: false,
                },
                number: {
                  density: {
                    enable: true,
                    area: 800,
                  },
                  value: 80,
                },
                shape: {
                  type: "circle",
                },
                size: {
                  value: { min: 1, max: 5 },
                },
              },
              detectRetina: true,
            }}
          />
        </motion.div>
        <style>
          {`
            .scroll-container {
              display: flex;
              overflow: hidden;
              white-space: nowrap;
            }
            .logo {
              flex: 0 0 auto;
              margin: 0 1rem;
              padding: 1rem;
              background: 
              ${
                colorScheme === "dark"
                  ? "rgba(255, 255, 255, 0.25)"
                  : "rgba(0, 0, 0, 0.1)"
              }
              
              ;
              border-radius: 8px;
              backdrop-filter: blur(10px);
              display: flex;
              justify-content: center;
              align-items: center;
              min-width: 150px;
              text-align: center;
            }
             
            .logo-img {
             filter: grayscale(100%) brightness(0) invert(
                ${colorScheme === "dark" ? 1 : 0}
              );
            }

            .logo img {
              max-width: 100%;
              max-height: 50px;
              filter: grayscale(100%) brightness(0) invert(
                ${colorScheme === "dark" ? 1 : 0}
              );
              opacity: 0.7;
            }
            .logo img:hover {
              opacity: 1;
            }
            .button-container {
              position: relative;
              overflow: hidden;
              display: inline-block;
            }
            .swipe-effect {
              position: absolute;
              top: 0;
              left: -100%;
              width: 100%;
              height: 100%;
              background: rgba(255, 255, 255, 0.2);
              pointer-events: none;
            }
          `}
        </style>
        <Container
          size="sm"
          style={{ textAlign: "center", zIndex: 1 }}
          component={motion.div}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
        >
          <Center>
            <motion.img
              className="logo-img"
              initial={{ y: -50 }}
              animate={{ y: 0 }}
              transition={{ type: "spring", stiffness: 100 }}
              style={{
                display: "block",
                margin: "0 auto",
              }}
              src="/csjobs_white.svg"
              alt="logo"
              height={100}
              width={200}
            />
          </Center>
          <Text
            size="lg"
            weight={700}
            style={{ marginBottom: theme.spacing.md }}
            component={motion.p}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
          >
            The one-stop platform for securing your dream internship.
          </Text>
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="button-container"
          >
            <Button
              size="lg"
              radius="xl"
              variant="filled"
              style={{ backgroundColor: theme.colors.teal[6] }}
              onClick={handleGetStarted}
            >
              <motion.div
                className="swipe-effect"
                initial={{ left: "-100%" }}
                whileHover={{ left: "100%" }}
                transition={{ duration: 0.5 }}
              />
              Start Applying, it's Free!
            </Button>
          </motion.div>
          <Text size="md" mt={25}>
            Trusted by top companies, worldwide.
          </Text>
        </Container>
        <Container
          size="md"
          style={{
            textAlign: "center",
            zIndex: 1,
          }}
          mt={10}
          component={motion.div}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
        >
          <Box style={{ overflow: "hidden", width: "100%" }}>
            <motion.div
              className="scroll-container"
              animate={{ x: -((duplicatedLogos.length / 2) * 150) }}
              transition={{
                repeat: Infinity,
                repeatType: "loop",
                ease: "linear",
                duration: 30,
              }}
              style={{ display: "flex", width: duplicatedLogos.length * 150 }}
            >
              {duplicatedLogos.map((logo, index) => (
                <Box key={index} className="logo">
                  <img src={logo} alt={`Company ${index + 1}`} />
                </Box>
              ))}
            </motion.div>
          </Box>
        </Container>
      </motion.div>
    )
  );
};

export default SplashPage;
