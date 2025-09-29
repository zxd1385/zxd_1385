export default function CustomCountdown({ targetDate, isLoading }) {
    const calculateTimeLeft = useCallback(() => {
      if (!targetDate) return undefined
  
      
      const difference = +new Date(targetDate) - +new Date()
      let _timeLeft = {}
  
      if (difference > 0) {
        _timeLeft = {
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        }
      }
  
      return _timeLeft
    }, [])
  
    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft())
  
    useEffect(() => {
      const timer = setTimeout(() => {
        setTimeLeft(calculateTimeLeft())
      }, 1000)
  
      return () => clearTimeout(timer)
    })
  
    // const boxBg = useColorModeValue("white", "gray.800");
    const targetDay = new Date(targetDate)
    const labelColor = useColorModeValue("gray.600", "gray.300")
    const numberColor = useColorModeValue("black", "white")
    const bg = useColorModeValue("white", "gray.900")
    const boxShadow = useColorModeValue("xl", "2xl")
    const MotionText = motion(chakra.span)
    if (!timeLeft && !isLoading) return <></>
  
    return (
      <VStack
        mt={10}
        spacing={4}
        p={4}
        bg={bg}
        boxShadow={boxShadow}
        rounded="md"
      >
        <Text fontSize="2xl" fontWeight="bold">
          {isLoading ? (
            <SkeletonText>Until Meet Starts</SkeletonText>
          ) : (
            "Until Meet Starts"
          )}
        </Text>
        {!isLoading ? (
          <HStack spacing={6} position="relative">
            {/* dot seperators */}
            <Box position="absolute" top="20px" left="100px" bg="white" width="8px" height="8px" borderRadius="50%"></Box>
            <Box position="absolute" top="50px" left="100px" bg="white" width="8px" height="8px" borderRadius="50%"></Box>
            <Box position="absolute" top="20px" left="219px" bg="white" width="8px" height="8px" borderRadius="50%"></Box>
            <Box position="absolute" top="50px" left="219px" bg="white" width="8px" height="8px" borderRadius="50%"></Box>
            <Box position="absolute" top="20px" left="337px" bg="white" width="8px" height="8px" borderRadius="50%"></Box>
            <Box position="absolute" top="50px" left="337px" bg="white" width="8px" height="8px" borderRadius="50%"></Box>
            
            <VStack>
              {}
              <DigitalCountdown value={timeLeft.days} width={50} height={20} />
              {/* <Text fontSize="2xl" as="b" color={numberColor}>
                {timeLeft.days || "0"}
              </Text> */}
              <Text fontSize="md" color={labelColor}>
                Days
              </Text>
            </VStack>
            <VStack>
            <DigitalCountdown value={timeLeft.hours} width={350} height={120} />
              {/* <Text fontSize="2xl" as="b" color={numberColor}>
                {timeLeft.hours || "0"}
              </Text> */}
              <Text fontSize="md" color={labelColor}>
                Hours
              </Text>
            </VStack>
            <VStack>
            <DigitalCountdown value={timeLeft.minutes} width={350} height={120} />
              {/* <Text fontSize="2xl" as="b" color={numberColor}>
                {timeLeft.minutes || "0"}
              </Text> */}
              <Text fontSize="md" color={labelColor}>
                Minutes
              </Text>
            </VStack>
            <VStack>
            {/* <PaperCountdown value={timeLeft.seconds} width={90} height={100} /> */}
            <DigitalCountdown value={timeLeft.seconds} width={350} height={120} />
              <Text fontSize="md" color={labelColor}>
                Seconds
              </Text>
            </VStack>
          </HStack>
        ) : (
          <HStack spacing={8}>
            <VStack gap={3}>
              <Skeleton rounded="xl" height="40px" width="40px" />
              <Skeleton rounded="xl" height="30px" width="40px" />
            </VStack>
            <VStack gap={3}>
              <Skeleton rounded="xl" height="40px" width="40px" />
              <Skeleton rounded="xl" height="30px" width="40px" />
            </VStack>
            <VStack gap={3}>
              <Skeleton rounded="xl" height="40px" width="40px" />
              <Skeleton rounded="xl" height="30px" width="40px" />
            </VStack>
            <VStack gap={3}>
              <Skeleton rounded="xl" height="40px" width="40px" />
              <Skeleton rounded="xl" height="30px" width="40px" />
            </VStack>
          </HStack>
        )}
      </VStack>
    )
}