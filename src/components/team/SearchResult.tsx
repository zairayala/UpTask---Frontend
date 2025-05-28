import { addUserToProject } from "@/api/TeamAPI"
import { TeamMember } from "@/types/index"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useParams } from "react-router-dom"
import { toast } from "react-toastify"

type SearchResultProps = {
    user: TeamMember
    reset: () => void
}
export default function SearchResult({user, reset} : SearchResultProps) {

    const params = useParams()
    const projectId = params.projectId! 

    const queryClient = useQueryClient()

    const { mutate } = useMutation({
        mutationFn: addUserToProject,
        onError: (error) => {
            toast.error(error.message)
        },
        onSuccess: (data) => {
            toast.success(data)
            reset()
            queryClient.invalidateQueries({queryKey: ['projectTeam', projectId]})
        }
    })

    const handleAddUserToProject = () => {
        const data = {
            projectId,
            id: user._id //como esta dentro de un objeto lo pasamos de esta manera
        }
        mutate(data)
    }
  return (
    <>
    <p className="mt-10 text-center font-bold">Resultado:</p>
    <div className="flex justify-between items-center">
        <p>{user.name}</p>
        <button 
        className="text-cyan-600 hover:bg-cyan-100 px-10 py-3 font-bold cursor-pointer"
        onClick={handleAddUserToProject}
        >
            Agregar al proyecto
        </button>
    </div>
    </>
  )
}
