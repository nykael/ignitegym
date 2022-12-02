import { createContext, ReactNode } from "react";

import { UserDTO } from "@dtos/UserDTO";

export type AuthContextDataProps = {
    user: UserDTO
}

type AuthContextProviderProps = {
    children: ReactNode
}

export const AuthContext = createContext<AuthContextDataProps>({} as AuthContextDataProps);

export function AuthContextProvider({children}: AuthContextProviderProps){
    return (
        <AuthContext.Provider value={{
            user: {
              id: '2',
              name: 'nykael',
              email: 'nykael@nykael.com',
              avatar: 'nykael.png'
            }
          }}
          >
           {children}
          </AuthContext.Provider>
    )
}