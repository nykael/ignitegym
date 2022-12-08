import { HistoryDTO } from "@dtos/HistoryDTO";
import { Heading, HStack, Text, VStack } from "native-base";

type HistoryCardProps = {
    data: HistoryDTO
}

export function HistoryCard({data} : HistoryCardProps) {
    return(
        <HStack w="full" px={5} py={3} mb={4} bg="gray.600" rounded="md" alignItems="center" justifyContent="space-between">
            <VStack>
                <Heading color="white" fontSize="md" fontFamily="heading" textTransform="capitalize">
                  {data.group}
                </Heading>

                <Text color="gray.100" fontSize="lg" numberOfLines={1}>
                 {data.name}
                </Text>
            </VStack>

            <Text color="gray.300" fontSize="md">
                {data.hour}
            </Text>
        </HStack>
    )
}