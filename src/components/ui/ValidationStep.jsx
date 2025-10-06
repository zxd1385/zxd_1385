import { Alert, AlertIcon, Spinner, HStack, Text } from "@chakra-ui/react";
import { LuCheck, LuXCircle } from "react-icons/lu";

const ValidationStep = ({ label, status, message }) => {
  const getIcon = () => {
    if (status === "loading") return <Spinner size="sm" color="yellow.400" />;
    if (status === "success") return <LuCheck color="limegreen" />;
    if (status === "error") return <LuXCircle color="red" />;
    return <></>;
  };

  const getColor = () => {
    if (status === "success") return "green.300";
    if (status === "error") return "red.300";
    if (status === "loading") return "yellow.300";
    return "gray.300";
  };

  return (
    <HStack
      border="1px solid"
      borderColor={getColor()}
      p={3}
      borderRadius="md"
      spacing={3}
      bg="gray.900"
    >
      {getIcon()}
      <Text color={getColor()} fontWeight="bold" flex="1">
        {label}
      </Text>
      <Text fontSize="sm" color="gray.400" flex="2">
        {status === "error" ? message : ""}
      </Text>
    </HStack>
  );
};

export default ValidationStep