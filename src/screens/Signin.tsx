import { useState } from 'react';
import { Platform } from 'react-native'
import { useForm, Controller } from 'react-hook-form';
import { useNavigation} from '@react-navigation/native';
import { VStack, Image, Text, Center, Heading, ScrollView, useToast } from 'native-base'


import {AuthNavigatorRoutesProps} from '@routes/auth.routes'

import { useAuth } from '@hooks/useAuth'

import LogoSvg from '@assets/logo.svg'
import BackgroundImg from '@assets/background.png'

import { Input } from '../components/input';
import { Buttom } from '@components/Button'
import { AppError } from '@utils/AppError';

type FormData = {
    email: string;
    password: string;
}

export function SignIn() {
    const [isLoading, setIsLoading] = useState(false)

    const toast = useToast()
    const { signIn } = useAuth()
    const navigation = useNavigation<AuthNavigatorRoutesProps>()

    const {control, handleSubmit, formState: {errors} } = useForm<FormData>()

    function handleNewAccount(){
        navigation.navigate('signUp');
    }

    async function handleSignIn({ email, password} : FormData) {
        try {
            setIsLoading(true)
           await signIn(email, password) 
        }catch(err) {
            const isAppError = err instanceof AppError;

            const title = isAppError ? err.message : 'Nâo foi possível entrar. Tente novamente mais tarde.'

            toast.show({
                title,
                placement: 'top',
                bgColor: 'red.500'
            })
            
            setIsLoading(false)
        }
    }

    return (
        <ScrollView contentContainerStyle={{flexGrow: 1}} showsVerticalScrollIndicator={false}>
            <VStack flex={1} px={10} pb={Platform.OS === "ios" ? 20 : 16}>
                <Image 
                source={BackgroundImg} 
                defaultSource={BackgroundImg}
                alt="Pessoas treinando" 
                resizeMode='contain'
                position="absolute"
                />

                <Center my={24}>
                    <LogoSvg />
                    <Text color="gray.100" fontSize="sm">
                        Treine sua mente e o seu corpo
                    </Text>
                </Center>

                <Center>
                    <Heading 
                    color="gray.100"
                    fontSize="2xl"
                    mb={6}
                    fontFamily="heading"
                    >
                    Acesse sua conta
                    </Heading>

                    <Controller
                     control={control}
                        name="email"
                        rules={{required: 'Informe o e-mail'}}
                        render={({ field: { onChange }}) => (
                            <Input 
                            placeholder='E-mail'
                            keyboardType="email-address"
                            autoCapitalize='none'
                            errorMessage={errors.email?.message}
                            onChangeText={onChange}
                            />
                    )}/>

                    <Controller
                     control={control}
                        name="password"
                        rules={{required: 'Informe sua senha'}}
                        render={({ field: { onChange }}) => (
                            <Input 
                            placeholder='Senha'
                            secureTextEntry
                            errorMessage={errors.password?.message}
                            onChangeText={onChange}
                            />
                    )}/>
                    
                    <Buttom  
                      title="Acessar"
                      onPress={handleSubmit(handleSignIn)}
                      isLoading={isLoading}
                    />
                </Center>

                <Center mt={24}>
                    <Text color="gray.100" fontSize="sm" mb={3} fontFamily="body">
                        Ainda não tem acesso?
                    </Text>

                    <Buttom  
                        onPress={handleNewAccount}
                        title="Criar conta"
                        variant="outline"
                    />
                </Center>
            </VStack>
        </ScrollView>
    )
}