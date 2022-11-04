import {Input as NativiBaseInput, IInputProps } from 'native-base'

export function Input ({...rest}: IInputProps) {
    return (
        <NativiBaseInput 
            bg="gray.700"
            h={16}
            px={4}
            borderWidth={0}
            fontSize="sm"
            color="white"
            fontFamily="body"
            mb={4}
            placeholderTextColor="gray.300"
            _focus={{
                bg: 'gray.700',
                borderWidth: 1,
                borderColor: 'green.500'
            }}
            {...rest}
        />
    );
}