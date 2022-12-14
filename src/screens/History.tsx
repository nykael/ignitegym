import { useCallback, useState } from "react";
import { Center, Heading, VStack, SectionList, Text, useToast  } from "native-base";

import { HistoryCard } from "@components/HistoryCard";
import { ScreenHeader } from "@components/ScreenHeader";
import { AppError } from "@utils/AppError";
import { api } from "@services/api";
import { useFocusEffect } from "@react-navigation/native";
import { HistoryByDayDTO } from "@dtos/HistoryByDayDTO";
import { Loading } from "@components/Loading";
import { useAuth } from "@hooks/useAuth";


export function History() {
    const [isLoading, setIsLoading] = useState(true)
    const [exercises, setExercises] = useState<HistoryByDayDTO[]>([])
    
    const toast = useToast()

    const {refreshedToken} = useAuth()

    async function  fetchHistory() {
        try {
            setIsLoading(true)

            const response = await api.get('/history')
            setExercises(response.data)
            
        } catch (err) {
            const isAppError = err instanceof AppError
            const title = isAppError ? err.message : 'Não foi possível carregar o histórico.'
    
            toast.show({
              title,
              placement: 'top',
              bgColor: 'red.500'
            })
        } finally {
            setIsLoading(false)
        }
    }

    useFocusEffect(useCallback(() => {
        fetchHistory()
    }, [refreshedToken]))

   return(
    <VStack flex={1}>
       <ScreenHeader title="Histórico de Exercícios" />

        {
            isLoading ? <Loading /> : (

                exercises?.length > 0 ?  <SectionList 
                sections={exercises}
                keyExtractor={item => item.id}
                renderItem={({item}) => (
                    <HistoryCard 
                        data={item}
                    /> 
                )}
                renderSectionHeader={({section}) => (
                    <Heading color="gray.200" fontSize="md" mt={10} mb={3}>
                        {section.title}
                    </Heading>
                )}
                px={8}
                contentContainerStyle={exercises.length === 0 && {flex: 1, justifyContent: 'center'}}
            />

            :
                <Center flex={1}>
                    <Text color="gray.100" textAlign="center">
                    Não há exercícios registrados ainda. {'\n'}
                    Vamos fazer exercícios hoje ?
                    </Text>
                </Center>
            )
        
        }
    </VStack>
   ) 
}