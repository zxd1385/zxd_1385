import React, { useState, useEffect } from "react";
import { Box, Flex } from "@chakra-ui/react";

// Define 7-segment representation for each digit
const segments = {
  "0": [1, 1, 1, 1, 1, 1, 0], // top, upper-right, bottom-right, bottom, lower-left, upper-left, middle
  "1": [0, 1, 1, 0, 0, 0, 0],
  "2": [1, 1, 0, 1, 1, 0, 1],
  "3": [1, 1, 1, 1, 0, 0, 1],
  "4": [0, 1, 1, 0, 0, 1, 1],
  "5": [1, 0, 1, 1, 0, 1, 1],
  "6": [1, 0, 1, 1, 1, 1, 1],
  "7": [1, 1, 1, 0, 0, 0, 0],
  "8": [1, 1, 1, 1, 1, 1, 1],
  "9": [1, 1, 1, 1, 0, 1, 1],
};

// Helper function to map the value into segments for 7-segment display
const getDigits = (value) => {
  const strValue = value.toString();
  let digitArr = strValue.split("").map((digit) => segments[digit]);
  console.log(digitArr)
  if (digitArr.length == 1){
    digitArr = [segments[0], ...digitArr]
  }
  return digitArr
};

const DigitalCountdown = ({ value = 10 }) => {
  const [digits, setDigits] = useState(getDigits(value));

  // Update digits whenever the value prop changes
  useEffect(() => {
    setDigits(getDigits(value));  // Update digits when `value` changes
  }, [value]);  // Dependency array ensures this runs every time `value` changes

  const renderSegment = (active, isHorizontal) => (
    <Box
      w={isHorizontal ? "20px" : "3px"}
      h={isHorizontal ? "3px" : "20px"}
      bg={active ? "red.500" : "transparent"}
      borderRadius="2px"
    />
  );

  return (
    <Flex justify="center" align="center" >
      <Flex gap="3px">
        {digits.map((digitSegments, index) => (
          <Box
            key={index}
            display="flex"
            flexDirection="column"
            justifyContent="space-between"
            gap="1px"
          >
            {/* Top segment */}
            <Flex justify="center" gap="5px">
              {renderSegment(digitSegments[0], true)}
            </Flex>
            {/* Middle segments */}
            <Flex justify="center" gap="20px">
              {renderSegment(digitSegments[5])}
              {renderSegment(digitSegments[1])}
            </Flex>
            {/* Bottom segment */}
            <Flex justify="center" gap="25px">
              {renderSegment(digitSegments[6], true)}
            </Flex>
            {/* Left and right segments */}
            <Flex justify="space-between">
              <Box>
                {renderSegment(digitSegments[4])}
              </Box>
              <Box>
                {renderSegment(digitSegments[2])}
              </Box>
            </Flex>
            <Flex justify="center" gap="5px">
              {renderSegment(digitSegments[3], true)}
            </Flex>
          </Box>
        ))}
      </Flex>
    </Flex>
  );
};

export default DigitalCountdown;
