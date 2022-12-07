import { createContext, ReactNode, useEffect, useState } from "react";

import { storageUserSave, storageUserGet, storageUserRemove } from "@storage/storageUser";

import { api } from "@services/api";

import { UserDTO } from "@dtos/UserDTO";

export type AuthContextDataProps = {
    user: UserDTO;
    signIn: (email: string,  password: string) => Promise<void>;
    isLoadingUserStorageData: boolean;
    signOut: () => Promise<void>
}

type AuthContextProviderProps = {
    children: ReactNode
}

export const AuthContext = createContext<AuthContextDataProps>({} as AuthContextDataProps);

export function AuthContextProvider({children}: AuthContextProviderProps){
    const [user, setUser] = useState({} as UserDTO)
    const [isLoadingUserStorageData, setIsLoadingUserStorageData] = useState(true)

    async function signIn(email: string,  password: string) {
        try {

           const {data} = await api.post('/sessions', {email, password});
    
           if(data.user){
              setUser(data.user);
              storageUserSave(data.user)
           }

        } catch (err) {
            console.log(err);
            throw err;
             
        }
    }

    async function loadUserData(){
        try {
            const userLogged = await storageUserGet()
     
            if(userLogged){
              setUser(userLogged)
     
              setIsLoadingUserStorageData(false)
            }

        } catch (err) {
            throw err

        } finally {
            setIsLoadingUserStorageData(false)
        }
    }

    async function signOut() {
        try {
            setIsLoadingUserStorageData(true)
            setUser({} as UserDTO)

            await storageUserRemove()

        } catch (err) {
            throw err

        }finally{
            setIsLoadingUserStorageData(false) 
        }
    }


    useEffect(() => {
        loadUserData()
    }, [])

    return (
        <AuthContext.Provider value={{ 
             user,
             signIn,
             isLoadingUserStorageData,
             signOut
            }}
          >
           {children}
          </AuthContext.Provider>
    )
}