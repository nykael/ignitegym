import { TouchableOpacity } from "react-native";
import { VStack, Icon, HStack, Heading, Text, Image, Box, useToast } from "native-base";
import {Feather} from '@expo/vector-icons'
import { useNavigation, useRoute } from "@react-navigation/native";

import { AppNavigatorRoutesProps } from "@routes/app.routes";

import { api } from "@services/api";
import { AppError } from "@utils/AppError";
import { ExerciseDTO } from "@dtos/ExerciseDTO";

import BodySvg from '@assets/body.svg'
import SeriesSvg from '@assets/series.svg'
import RepetitionsSvg from '@assets/repetitions.svg'
import { Buttom } from "@components/Button";
import { useEffect, useState } from "react";
import { Loading } from "@components/Loading";


type RoutParamsProps = {
  exerciseId: string
}

export function Exercise() {
    const [sendingRegister, setSendingRegister] =useState(false)
    const [isLoading, setIsLoading] =useState(true)
    const [exercise, setExercise] = useState<ExerciseDTO>({} as ExerciseDTO)
    const navigation = useNavigation<AppNavigatorRoutesProps>()
    const route = useRoute()
    const toast = useToast()

    const {exerciseId} = route.params as RoutParamsProps

    function handleGoBack() {
        navigation.goBack()
    }

    async function fetchExerciseDetails(){
      try {
          setIsLoading(true)
          const response = await api.get(`/exercises/${exerciseId}`)
          setExercise(response.data)
      } catch (err) {
        const isAppError = err instanceof AppError
        const title = isAppError ? err.message : 'Não foi possível carregar os detalhes do exercício.'

        toast.show({
          title,
          placement: 'top',
          bgColor: 'red.500'
        })
      }finally{
        setIsLoading(false)
      }
    }

    async function handleExerciseHistoryRegister() {
        try {

          setSendingRegister(true)
          
        } catch (err) {
          const isAppError = err instanceof AppError
          const title = isAppError ? err.message : 'Não foi possível registrar o exercício.'
  
          toast.show({
            title,
            placement: 'top',
            bgColor: 'red.500'
          })
        }finally{
          setSendingRegister(false)
        }
    }

    useEffect(() => {
      fetchExerciseDetails()
    },[exerciseId])

   return(
    <VStack flex={1}>
        <VStack px={8} bg="gray.800" pt={12}>
          <TouchableOpacity onPress={handleGoBack}>
             <Icon as={Feather} name="arrow-left" color="green.500" size={6} />
          </TouchableOpacity>

          <HStack justifyContent="space-between" mt={4} mb={8} alignItems="center">
            <Heading color="gray.100" fontSize="lg" flexShrink={1}>
                {exercise.name}
            </Heading>

            <HStack alignItems="center">
                <BodySvg />
              <Text color="gray.200" ml={1} textTransform="capitalize">
               {exercise.group}
              </Text>
            </HStack>
            </HStack>
        </VStack>

        {
            isLoading ? <Loading/> :
          <VStack p={8}>
            <Box rounded="lg" mb={3} overflow="hidden">

                <Image 
                  w="full"
                  h={80}
                  source={{uri: `${api.defaults.baseURL}/exercise/demo/${exercise.demo}`}}
                  alt="Nome do exercício"
                  resizeMode="cover"
                  />
            </Box>

            <Box bg="gray.600" rounded="md" pb={4} px={4}>
                <HStack alignItems="center" justifyContent="space-around" mb={6} mt={5}>

                <HStack>
                    <SeriesSvg />
                      <Text color="gray.200" ml={2}>
                       {exercise.series} séries
                      </Text>
                </HStack>

                <HStack>
                    <RepetitionsSvg />
                      <Text color="gray.200" ml={2}>
                         {exercise.repetitions} repetições
                      </Text>
                </HStack>
                </HStack>

                <Buttom 
                  title="Marcar como realizado"
                  isLoading={sendingRegister}
                  />
            </Box>
          </VStack>
        }
    </VStack>
   ) 
}