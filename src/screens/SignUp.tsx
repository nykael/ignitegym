import { VStack, Image, Text, Center, Heading, ScrollView } from 'native-base'

import LogoSvg from '@assets/logo.svg'
import BackgroundImg from '@assets/background.png'
import { Input } from '@components/input'
import { Buttom } from '@components/Button'
import { Platform } from 'react-native'

export function SignUp() {
    return (
        <ScrollView contentContainerStyle={{flexGrow: 1}} showsVerticalScrollIndicator={false}>
            <VStack flex={1}  px={10}  pb={Platform.OS === "ios" ? 60 : 16}>
                <Image 
                source={BackgroundImg} 
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
                    Crie Sua Conta
                    </Heading>

                    <Input  
                        placeholder='Nome'
                    />
                    <Input  
                        placeholder='E-mail'
                        keyboardType="email-address"
                        autoCapitalize='none'
                    />
                    <Input
                        placeholder='Senha'
                        secureTextEntry
                    />

                    <Buttom  title="Criar e acessar"/>
                </Center>

                    <Buttom 
                        mt={24} 
                        title="Voltar para o login"
                        variant="outline"
                    />
            </VStack>
        </ScrollView>
    )
}