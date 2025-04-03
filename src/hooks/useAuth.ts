import { getUser } from "@/api/AuthAPI"
import { useQuery } from "@tanstack/react-query"

export const useAuth = () => {
    const { data, isError, isLoading } = useQuery({
        queryKey: ['user'],
        queryFn: getUser, //llamamos a la api que devuelve el user que establecimos en el request (backend)
        retry: 1,
        refetchOnWindowFocus: false //para no hacer refetch cada que ingresamos a una pestaña
    }) 
    return { data, isError, isLoading }
}