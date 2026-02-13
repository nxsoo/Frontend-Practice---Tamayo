"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChatIcon,
  ArrowDownIcon,
  CalendarIcon,
  TimeIcon,
  StarIcon,
} from "@chakra-ui/icons";
import {
  Box,
  Container,
  Heading,
  Text,
  Image,
  VStack,
  HStack,
  Button,
  Flex,
} from "@chakra-ui/react";

const CAT_IMAGES = Array.from({ length: 8 }, (_, i) => `/images/${i + 1}.webp`);

// Timeline events
const TIMELINE_EVENTS = [
  { date: "September 2, 2024", description: "The moment everything started" },
  { date: "November 4, 2024", description: "Coffee and endless conversations" },
  { date: "November 31, 2024", description: "Butterflies everywhere" },
  { date: "July 22, 2025", description: "A quiet spark we kept to ourselves" },
  { date: "December 19, 2025", description: "A simple promise, softly said" },
];

export default function Home() {
  const [noCount, setNoCount] = useState(0);
  const [yesPressed, setYesPressed] = useState(false);
  const [rain, setRain] = useState<{ id: number; x: number; img: string; duration: number; size: number }[]>([]);
  const [hearts, setHearts] = useState<{ id: number; x: number; duration: number; delay: number }[]>([]);
  const [showAnimations, setShowAnimations] = useState(false);
  const [noButtonPos, setNoButtonPos] = useState({ x: 0, y: 0 });
  const [explodingCats, setExplodingCats] = useState<{ id: number; angle: number; img: string; size: number }[]>([]);
  const [fadingCats, setFadingCats] = useState<{ id: number; x: number; y: number; img: string; size: number; duration: number }[]>([]);
  const [fadingHearts, setFadingHearts] = useState<{ id: number; x: number; y: number; size: number; duration: number }[]>([]);

  // Cat rain logic
  useEffect(() => {
    const interval = setInterval(() => {
      if (showAnimations && !yesPressed) {
        setRain((prev) => [
          ...prev.slice(-15),
          {
            id: Math.random(),
            x: Math.random() * 100,
            img: CAT_IMAGES[Math.floor(Math.random() * CAT_IMAGES.length)],
            duration: Math.random() * 3 + 2,
            size: Math.floor(Math.random() * 40) + 60,
          },
        ]);
      }
    }, 700);
    return () => clearInterval(interval);
  }, [showAnimations, yesPressed]);

  // Floating hearts logic
  useEffect(() => {
    const interval = setInterval(() => {
      if (showAnimations && !yesPressed) {
        setHearts((prev) => [
          ...prev.slice(-20),
          {
            id: Math.random(),
            x: Math.random() * 100,
            duration: Math.random() * 4 + 4,
            delay: Math.random() * 0.5,
          },
        ]);
      }
    }, 500);
    return () => clearInterval(interval);
  }, [showAnimations, yesPressed]);

  // Exploding cats logic when yes is pressed
  useEffect(() => {
    if (yesPressed) {
      const cats = Array.from({ length: 30 }, (_, i) => ({
        id: Math.random(),
        angle: (i * 360) / 30,
        img: CAT_IMAGES[Math.floor(Math.random() * CAT_IMAGES.length)],
        size: Math.floor(Math.random() * 50) + 40,
      }));
      setExplodingCats(cats);
      setRain([]);
      setHearts([]);
    }
  }, [yesPressed]);

  // Continuous fading cats and hearts after explosion
  useEffect(() => {
    if (yesPressed) {
      const timeout = setTimeout(() => {
        const interval = setInterval(() => {
          setFadingCats((prev) => [
            ...prev.slice(-20),
            {
              id: Math.random(),
              x: Math.random() * 100,
              y: Math.random() * 100,
              img: CAT_IMAGES[Math.floor(Math.random() * CAT_IMAGES.length)],
              size: Math.floor(Math.random() * 60) + 40,
              duration: Math.random() * 4 + 3,
            },
          ]);
        }, 800);
        return () => clearInterval(interval);
      }, 2000);

      const heartTimeout = setTimeout(() => {
        const interval = setInterval(() => {
          setFadingHearts((prev) => [
            ...prev.slice(-15),
            {
              id: Math.random(),
              x: Math.random() * 100,
              y: Math.random() * 100,
              size: Math.floor(Math.random() * 30) + 20,
              duration: Math.random() * 4 + 3,
            },
          ]);
        }, 600);
        return () => clearInterval(interval);
      }, 2000);

      return () => {
        clearTimeout(timeout);
        clearTimeout(heartTimeout);
      };
    }
  }, [yesPressed]);

  const handleNoClick = () => {
    setNoCount((prev) => prev + 1);
    setNoButtonPos({
      x: Math.random() * 200 - 100,
      y: Math.random() * 200 - 100
    });
  };
  const yesButtonSize = noCount * 80 + 18;
  const noButtonSize = Math.max(10, 14 - noCount * 2);

  return (
    <Box position="relative" w="full" bg="background" fontFamily="sans-serif" overflowX="hidden">
      {/* Background animations (cats and hearts) */}
      <Box position="fixed" inset="0" pointerEvents="none" zIndex={0} overflow="hidden">
        <AnimatePresence>
          {rain.map((cat) => (
            <motion.img
              key={cat.id}
              src={cat.img}
              initial={{ y: -150, x: `calc(${cat.x}vw - ${cat.size / 2}px)`, opacity: 0 }}
              animate={{ y: "110vh", opacity: 1, rotate: 360 }}
              exit={{ opacity: 0 }}
              transition={{ duration: cat.duration, ease: "linear" }}
              style={{ width: cat.size, height: cat.size, left: 0 }}
              className="fixed rounded-full border-4 border-white shadow-2xl object-cover bg-valentine-pink"
            />
          ))}
        </AnimatePresence>
        <AnimatePresence>
          {hearts.map((heart) => (
            <motion.div
              key={heart.id}
              initial={{ y: "-100vh", x: `${heart.x}vw`, opacity: 0, scale: 0 }}
              animate={{ y: "100vh", opacity: [0, 1, 1, 0], scale: [0, 1, 1, 0] }}
              exit={{ opacity: 0 }}
              transition={{ duration: heart.duration, ease: "easeInOut", delay: heart.delay }}
              className="fixed flex items-center justify-center text-3xl"
              style={{ fontSize: "2rem" }}
            >
              ❤️
            </motion.div>
          ))}
        </AnimatePresence>
        {/* Exploding cats */}
        <AnimatePresence>
          {explodingCats.map((cat) => {
            const radians = (cat.angle * Math.PI) / 180;
            const distance = 150;
            const endX = Math.cos(radians) * distance;
            const endY = Math.sin(radians) * distance;
            return (
              <motion.img
                key={cat.id}
                src={cat.img}
                initial={{ x: "50vw", y: "50vh", opacity: 0, scale: 0, rotate: 0 }}
                animate={{ 
                  x: `calc(50vw + ${endX}vw)`, 
                  y: `calc(50vh + ${endY}vh)`, 
                  opacity: [0, 1, 1, 0], 
                  scale: [0, 1.2, 1.2, 0],
                  rotate: cat.angle * 2
                }}
                exit={{ opacity: 0 }}
                transition={{ duration: 2, ease: "easeOut" }}
                style={{ width: cat.size, height: cat.size }}
                className="fixed rounded-full border-4 border-white shadow-2xl object-cover bg-valentine-pink"
              />
            );
          })}
        </AnimatePresence>
        {/* Fading cats after explosion */}
        <AnimatePresence>
          {fadingCats.map((cat) => (
            <motion.img
              key={cat.id}
              src={cat.img}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: [0, 0.8, 0], scale: [0, 1, 0] }}
              exit={{ opacity: 0 }}
              transition={{ duration: cat.duration, ease: "easeInOut" }}
              style={{ 
                width: cat.size, 
                height: cat.size, 
                left: `${cat.x}vw`, 
                top: `${cat.y}vh`,
                transform: 'translate(-50%, -50%)'
              }}
              className="fixed rounded-full border-4 border-white shadow-2xl object-cover bg-valentine-pink"
            />
          ))}
        </AnimatePresence>
        {/* Fading hearts after explosion */}
        <AnimatePresence>
          {fadingHearts.map((heart) => (
            <motion.div
              key={heart.id}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: [0, 0.9, 0], scale: [0, 1, 0] }}
              exit={{ opacity: 0 }}
              transition={{ duration: heart.duration, ease: "easeInOut" }}
              style={{ 
                left: `${heart.x}vw`, 
                top: `${heart.y}vh`,
                fontSize: `${heart.size}px`,
                transform: 'translate(-50%, -50%)'
              }}
              className="fixed flex items-center justify-center"
            >
              ❤️
            </motion.div>
          ))}
        </AnimatePresence>
      </Box>

      {/* SECTION 1: Cupid's Letter */}
      <Box as="section" position="relative" zIndex={10} minH="100vh" display="flex" alignItems="center" justifyContent="center" px={4} bgImage="url(/images/bg.webp)" bgSize="cover" bgPosition="center">
        <Box position="absolute" inset="0" />
        <Box
          as={motion.div}
          initial={{ scale: 0.8, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6 }}
          w="full"
          maxW="4xl"
          position="relative"
          zIndex={20}
        >
          {/* Floating Cupid on top left */}
          <Image
            as={motion.img}
            src="/images/cupid.webp"
            alt="Cupid"
            position="absolute"
            top="-180px"
            left="-224px"
            w="400px"
            h="400px"
            objectFit="contain"
            zIndex={20}
            animate={{ y: [0, -20, 0] }}
            transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
          />

          <VStack
            bg="whiteAlpha.700"
            backdropFilter="blur(40px)"
            borderRadius="3xl"
            boxShadow="2xl"
            p={{ base: 8, md: 12 }}
            textAlign="center"
            border="1px"
            borderColor="rose.100"
            spacing={6}
          >
            <Box mb={2}>
              <ChatIcon w={16} h={16} color="#e11d48" />
            </Box>
            <Heading
              fontSize={{ base: "4xl", md: "5xl" }}
              fontWeight="black"
              color="#e11d48"
              mb={2}
            >
              Someone is thinking of you
            </Heading>
            <Text fontSize="lg" color="rose.800" opacity={0.7} lineHeight="relaxed">
              Consider this an official delivery from Cupid.
            </Text>
            <Box
              as={motion.div}
              animate={{ y: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
              mt={4}
            >
              <ArrowDownIcon w={12} h={12} color="#e11d48" />
            </Box>
          </VStack>
        </Box>
      </Box>

      {/* SECTION 2: Relationship Timeline */}
      <Box as="section" position="relative" zIndex={10} minH="100vh" display="flex" alignItems="center" justifyContent="center" px={4} py={20} onMouseEnter={() => setShowAnimations(true)}>
        <Container maxW="4xl">
          <Heading fontSize="5xl" fontWeight="black" color="#e11d48" textAlign="center" mb={16}>
            <HStack justify="center" spacing={4}>
              <Text>Our Timeline</Text>
              <CalendarIcon w={12} h={12} />
            </HStack>
          </Heading>
          <VStack spacing={12}>
            {TIMELINE_EVENTS.map((event, index) => (
              <Flex
                key={index}
                as={motion.div}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                gap={8}
                alignItems="center"
                flexDirection={index % 2 === 1 ? "row-reverse" : "row"}
                w="full"
              >
                <Box
                  flex={1}
                  bg="whiteAlpha.700"
                  backdropFilter="blur(40px)"
                  borderRadius="2xl"
                  p={6}
                  border="1px"
                  borderColor="rose.100"
                  boxShadow="lg"
                >
                  <Heading fontSize="2xl" fontWeight="bold" color="#e11d48" mb={2}>
                    {event.date}
                  </Heading>
                  <Text color="rose.800" opacity={0.7}>
                    {event.description}
                  </Text>
                </Box>
                <Flex
                  display={{ base: "none", md: "flex" }}
                  w={12}
                  h={12}
                  borderRadius="full"
                  bg="#e11d48"
                  flexShrink={0}
                  alignItems="center"
                  justifyContent="center"
                  color="white"
                  fontSize="xl"
                  fontWeight="bold"
                >
                  {index + 1}
                </Flex>
              </Flex>
            ))}
          </VStack>
        </Container>
      </Box>

      {/* SECTION 3: Memories with Images */}
      <Box as="section" position="relative" zIndex={10} minH="100vh" display="flex" alignItems="center" justifyContent="center" px={4} py={20}>
        <Container maxW="6xl">
          <Heading fontSize="5xl" fontWeight="black" color="#e11d48" textAlign="center" mb={16}>
            <HStack justify="center" spacing={4}>
              <Text>Our Memories</Text>
              <TimeIcon w={12} h={12} />
            </HStack>
          </Heading>
          <Box
            display="grid"
            gridTemplateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }}
            gap={6}
          >
            {[1, 2, 3, 4].map((i) => (
              <Box
                key={i}
                as={motion.div}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                aspectRatio={1}
                w="full"
                borderRadius="2xl"
                overflow="hidden"
                boxShadow="lg"
                border="2px"
                borderColor="rose.100"
                bgGradient="linear(to-br, valentine-pink, rose.200)"
              >
                <Image
                  src={`/images/memory${i}.webp`}
                  alt={`Memory ${i}`}
                  h="full"
                  w="full"
                  objectFit="cover"
                />
              </Box>
            ))}
          </Box>
        </Container>
      </Box>

      {/* SECTION 4: Valentine Question Card */}
      <Box as="section" position="relative" zIndex={10} minH="100vh" display="flex" alignItems="center" justifyContent="center" px={4} py={20}>
        <Box
          as={motion.main}
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: [0, -10, 0], opacity: 1 }}
          transition={{ y: { repeat: Infinity, duration: 4, ease: "easeInOut" }, opacity: { duration: 0.5 } }}
          w="full"
          maxW="xl"
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          py={16}
          px={8}
          bg="whiteAlpha.700"
          backdropFilter="blur(40px)"
          borderRadius="3.5rem"
          boxShadow="0 20px 70px rgba(225,29,72,0.15)"
          textAlign="center"
          border="1px"
          borderColor="rose.100"
          position="relative"
        >
          {/* Question cat image on top right */}
          {!yesPressed && (
            <Image
              src="/images/questioncat.webp"
              alt="Question cat"
              position="absolute"
              top="-64px"
              right="-96px"
              w={180}
              h={80}
              objectFit="contain"
            />
          )}
          {yesPressed ? (
            <VStack
              as={motion.div}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6 }}
              spacing={6}
            >
              <Box position="relative">
                <Box
                  as={motion.div}
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                  position="absolute"
                  top="-20px"
                  left="-20px"
                  fontSize="4xl"
                >
                  💝
                </Box>
                <Box
                  as={motion.div}
                  initial={{ scale: 0, rotate: 180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                  position="absolute"
                  top="-20px"
                  right="-20px"
                  fontSize="4xl"
                >
                  💖
                </Box>
                <Image
                  as={motion.img}
                  src="/images/happycat.gif"
                  alt="Happy cats"
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.7 }}
                  borderRadius="3xl"
                  border="8px solid white"
                  w="320px"
                  mx="auto"
                />
              </Box>
              
              <VStack
                as={motion.div}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                spacing={3}
              >
                <Heading
                  fontSize={{ base: "4xl", md: "5xl" }}
                  fontWeight="black"
                  textAlign="center"
                  letterSpacing="tight"
                  sx={{
                    backgroundImage: 'linear-gradient(to right, #e11d48, #f43f5e, #e11d48)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                  }}
                >
                  You just made my day
                </Heading>
                
                <Box h="2px" w="24" borderRadius="full" bg="linear-gradient(to right, transparent, #e11d48, transparent)" />
                
                <HStack fontSize="2xl" fontWeight="bold" color="#e11d48" spacing={2}>
                  <Text>Forever and always</Text>
                  <StarIcon w={6} h={6} />
                </HStack>
                
                <Text fontSize="lg" color="rose.600" fontStyle="italic" opacity={0.8}>
                  My one and only Valentine 💕
                </Text>
              </VStack>
            </VStack>
          ) : (
            <VStack spacing={10}>
              <VStack spacing={2}>
                <Text fontSize="sm" fontWeight="bold" letterSpacing="widest" color="#e11d48" textTransform="uppercase" opacity={0.6}>
                  A Special Invitation
                </Text>
                <Heading fontSize={{ base: "4xl", sm: "6xl" }} fontWeight="black" lineHeight="tight" letterSpacing="tighter" mt={2}>
                  <HStack justify="center" spacing={2}>
                    <Text>Will you be my Valentine?</Text>
                  </HStack>
                </Heading>
              </VStack>

              <Flex flexDirection={{ base: "column", sm: "row" }} alignItems="center" gap={6}>
                <Button
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  borderRadius="full"
                  bg="#e11d48"
                  color="white"
                  _hover={{ filter: "brightness(1.1)" }}
                  _active={{ transform: "scale(0.9)" }}
                  boxShadow="0 10px 30px rgba(225, 29, 72, 0.3)"
                  fontWeight="bold"
                  fontSize={`${yesButtonSize}px`}
                  py={`${Math.max(16, yesButtonSize / 2)}px`}
                  px={`${Math.max(40, yesButtonSize)}px`}
                  onClick={() => setYesPressed(true)}
                >
                  Yes
                </Button>

                <Button
                  onClick={handleNoClick}
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  borderRadius="full"
                  border="2px"
                  borderColor="rgba(225, 29, 72, 0.2)"
                  px={8}
                  fontWeight="bold"
                  color="#e11d48"
                  bg="transparent"
                  _hover={{ bg: "#e11d48", color: "white" }}
                  fontSize={`${noButtonSize}px`}
                  h={`${Math.max(48, 56 - noCount * 4)}px`}
                  opacity={Math.max(0.2, 1 - noCount * 0.15)}
                  transform={`translate(${noButtonPos.x}px, ${noButtonPos.y}px)`}
                  transition="transform 0.3s ease, opacity 0.3s ease"
                >
                  {noCount === 0 ? "No" : "Rethink this... 😿"}
                </Button>
              </Flex>
            </VStack>
          )}
        </Box>
      </Box>
    </Box>
  );
}