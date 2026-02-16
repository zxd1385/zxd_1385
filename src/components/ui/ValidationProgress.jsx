import {
    Card,
    VStack,
    HStack,
    Box,
    Heading,
    Alert,
    Progress,
    Text,
  } from "@chakra-ui/react";
  import { LuCheck , LuLoader, LuClock, LuTriangleAlert } from "react-icons/lu";
  
  const ValidationProgress = ({
    titleValidation,
    titleErrors,
    shortdescValidation,
    shortdescErrors,
    bodyValidation,
    bodyErrors,
    isfSubmited,
  }) => {
    const steps = [
      {
        label: "Title",
        validation: titleValidation,
        error: titleErrors,
        successMsg: "Title validated successfully!",
      },
      {
        label: "Short Description",
        validation: shortdescValidation,
        error: shortdescErrors,
        successMsg: "Short description validated successfully!",
      },
      {
        label: "Body",
        validation: bodyValidation,
        error: bodyErrors,
        successMsg: "Body validated successfully!",
      },
    ];
  
    const progressValue =
      (Number(!titleErrors) + Number(!shortdescErrors) + Number(!bodyErrors)) *
      33;

      const completedSteps = steps.filter((s) => !s.error && !s.validation && isfSubmited);
      const activeStep = steps[completedSteps.length];

    return (
      <Card.Root
        bg="gray.800"
        color="gray.100"
        p={2}
        borderRadius="2xl"
        boxShadow="xl"
        width="100%"
        variant="subtle"
        _hover={{ boxShadow: "2xl" }}
        transition="all 0.2s ease-in-out"
      >
        <Card.Header borderBottom="1px solid" borderColor="gray.700" pb={3}>
          <Heading size="md" color="gray.300">
            Validation Progress
          </Heading>
          
        </Card.Header>
  
        <Card.Body gap="2">
          <VStack align="stretch" spacing={2}>
            {steps.map(({ label, validation, error, successMsg }) => (
                
              <Box
                key={label}
                p={3}
                borderRadius="lg"
                borderWidth="1px"
                borderColor="gray.700"
                bg="gray.900"
              >
                <Heading size="sm" color="purple.200" mb={1}>
                  {label}
                </Heading>
  
                {validation ? (
                  <HStack>
                    <LuLoader className="animate-spin" />
                    <Text color="yellow.300">Validating...</Text>
                  </HStack>
                ) : error.length == 0 ? (
                    <HStack>
                    <LuClock />
                    <Text color="gray.500">Wating to be checked</Text>
                  </HStack>
                ) : error[0] != 'z' ? (
                  <HStack color="red.300">
                    
                    <Text><LuTriangleAlert />{error}</Text>
                  </HStack>
                ) : isfSubmited ? (
                  <HStack color="green.400">
                    <LuCheck />
                    <Text>{successMsg}</Text>
                  </HStack>
                ) : (
                  <Text color="gray.500">Idle</Text>
                )}
              </Box>
            ))}
          </VStack>
  
          
  
          
        </Card.Body>
  
        <Card.Footer borderTop="1px solid" borderColor="gray.700" pt={3}>
          <Text fontSize="xs" color="gray.500">
            Powered by zxdClub AI validation system
          </Text>
        </Card.Footer>
      </Card.Root>
    );
  };
  
  export default ValidationProgress;
  