import { useState } from "react";
import { TouchableOpacity } from "react-native";
import { Center, ScrollView, VStack, Skeleton, Text, Heading, useToast } from "native-base";

import * as yup from 'yup'
import * as FileSystem from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';
import { Controller, useForm } from "react-hook-form";
import {yupResolver} from '@hookform/resolvers/yup'

import DefaultUserPhotoImg from '@assets/userPhotoDefault.png'


import { useAuth } from "@hooks/useAuth";
import { Input } from "../components/input";
import { Buttom } from "@components/Button";
import { UserPhoto } from "@components/UserPhoto";
import { ScreenHeader } from "@components/ScreenHeader";
import { api } from "@services/api";
import { AppError } from "@utils/AppError";

const PHOTO_SIZE = 33

type FormDataProps = {
  name: string;
  email: string;
  password: string;
  old_password: string;
  confirm_password: string;
}

const profileSchema = yup.object({
  name: yup.string().required('Informe o nome.'),
  old_password: yup.string(),
  password: yup.string().min(6, 'A senha deve ter pelo menos 6 dígitos').nullable().transform((value) =>  !!value ? value: null),
  confirm_password: yup.string()
  .nullable()
  .transform((value) =>  !!value ? value: null)
  .oneOf([yup.ref('password'), null], 'A confirmação de senha não confere')
  .when('password', {
    is : (Field : any) => Field,
    then: yup.string()
    .nullable()
    .required('Informe a confirmação da senha')
    .transform((value) =>  !!value ? value: null)
  })
})

export function Profile() {
    const [isUpdating, setIsUpdating ] = useState(false)
    const [photoIsLoading, setPhotoIsLoading] = useState(false)

    const Toast = useToast()

    const {user, updateUserProfile} = useAuth()

    const {control, handleSubmit, formState: {errors}} = useForm<FormDataProps>({
      defaultValues: {
        name: user.name,
        email: user.email,
      },
      resolver: yupResolver(profileSchema)
    })

    async function handleProfileUpdate(data : FormDataProps) {
       try {
        setIsUpdating(true)
        const userUpdated = user;
        userUpdated.name = data.name

        await api.put('/users', data)

        await updateUserProfile(userUpdated)

        Toast.show({
          title: 'Perfil atualizado com sucesso!',
          placement: 'top',
          bg: 'green.500'
        })
       } catch (err) {
        const isAppError = err instanceof AppError
        const title = isAppError ?  err.message : 'Não foi possível atualizar os dados. tente novamente mais tarde!';

        Toast.show({
          title,
          placement: 'top',
          bg:"red.500"
        })
        
      } finally{
        setIsUpdating(false)
      }
    }


    async function handleUserPhotoSelect() {
      setPhotoIsLoading(true)
      try {
        const photoSelected = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          quality: 1,
          aspect: [4,4],
          allowsEditing: true,
         });
  
         if(photoSelected.cancelled) {
            return
         }

         if(photoSelected.uri){
           const photoInfo = await FileSystem.getInfoAsync(photoSelected.uri)
          
           if(photoInfo.size && (photoInfo.size /1024 /1024) > 5){
            return Toast.show({
              title: "Essa imagem é muito grande. Escolha uma de até 5MB",
              placement: 'top',
              bgColor: 'red.500'
            })
           }

           const fileExtension = photoSelected.uri.split('.').pop();

           const photoFile = {
             name: `${user.name.match(/^[^\s]+/)}.${fileExtension}`.toLocaleLowerCase(),
             uri: photoSelected.uri,
             type: `${photoSelected.type}/${fileExtension}`
           } as any

           const userPhotoUploadForm = new FormData()
           userPhotoUploadForm.append('avatar',photoFile)

           const avatarUpdatedResponse = await api.patch('/users/avatar', userPhotoUploadForm, {
            headers: {
              'Content-Type' : 'multipart/from-data'
            }
           })

           Toast.show({
            title: 'Foto atualizada!',
            placement: 'top',
            bg: 'green.500'
           })

           const userUpdated = user;
           userUpdated.avatar = avatarUpdatedResponse.data.avatar;

           updateUserProfile(userUpdated)

           console.log(userUpdated)
         }
      } catch (error) {
        console.log(error) 
      }finally{
        setPhotoIsLoading(false)
      }
    }

   return(
    <VStack flex={1}>
        <ScreenHeader title="Perfil"/>

          <ScrollView contentContainerStyle={{paddingBottom: 36}}>
            <Center mt={6} px={10}>
                {
                   photoIsLoading ?
                     <Skeleton 
                       w={PHOTO_SIZE}
                       h={PHOTO_SIZE}
                       rounded="full"
                       startColor="gray.500"
                       endColor="gray.400"
                    />
                    :
                    <UserPhoto 
                    source={
                      user.avatar 
                      ? {uri: `${api.defaults.baseURL}/avatar/${user.avatar}`}
                      : DefaultUserPhotoImg
                    }
                      size={PHOTO_SIZE}
                      alt="Foto do usuário"  
                    />
            }

            <TouchableOpacity onPress={handleUserPhotoSelect}>
                <Text color="green.500" fontSize="md" mt={2}  mb={8}>
                    Alterar foto
                </Text>
            </TouchableOpacity>

            <Controller 
              control={control}
              name="name"
              render={({field: {onChange, value}}) => (
                <Input  
                   bg="gray.600"
                   placeholder="Nome"
                   onChangeText={onChange}
                   value={value}
                   errorMessage={errors.name?.message}
                />
              )}
            />
            
            <Controller 
              control={control}
              name="email"
              render={({field: {onChange, value}}) => (
                <Input  
                   bg="gray.600"
                   placeholder="E-mail"
                  isDisabled

                   onChangeText={onChange}
                   value={value}
                />
              )}
            />

                <Heading color="gray.200" fontSize="md" fontFamily="heading" mb={2} alignSelf="flex-start" mt={12}>
                    Alterar senha
                </Heading>


                <Controller 
                  control={control}
                  name="old_password"
                  render={({field: {onChange}}) => (
                  <Input  
                     bg="gray.600"
                    placeholder="Senha antiga"
                    secureTextEntry

                    onChangeText={onChange}
                   errorMessage={errors.old_password?.message}

                  />
                 )}
                />

                <Controller 
                  control={control}
                  name="password"
                  render={({field: {onChange}}) => (
                  <Input  
                     bg="gray.600"
                    placeholder="Nova senha"
                    secureTextEntry
                   errorMessage={errors.password?.message}

                    onChangeText={onChange}
                  />
                 )}
                />


                <Controller 
                  control={control}
                  name="confirm_password"
                  render={({field: {onChange}}) => (
                  <Input  
                     bg="gray.600"
                    placeholder="Confirme a nova senha"
                    secureTextEntry
                   errorMessage={errors.confirm_password?.message}
                    onChangeText={onChange}
                  />
                 )}
                />

                <Buttom 
                 title="Atualizar"
                 onPress={handleSubmit(handleProfileUpdate)}
                 mt={4}
                 isLoading={isUpdating}
                />
             </Center>
        </ScrollView>
    </VStack>
   ) 
}