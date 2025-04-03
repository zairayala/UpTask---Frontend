import { Navigate, useParams } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { getProjectById } from "@/api/ProjectAPI"
import EditProjectForm from "@/components/projects/EditProjectForm"

export default function EditProjectView() {
    const params = useParams()
    const projectId = params.projectId!
      const { data, isError, isLoading } = useQuery({
        queryKey: ['editProject', projectId], //necesitamos guardar ambos para identificar al proyecto especifico, 
        // sino ponemos projectId solo guardara los datos del primer project que consultamos
        queryFn: () => getProjectById(projectId),
        retry: false //para que sea mas rapido
      })
    if(isLoading) return 'Cargando...'
    if(isError) return <Navigate to='/404' />
    if(data) return <EditProjectForm data={data} projectId={projectId}/>
}
