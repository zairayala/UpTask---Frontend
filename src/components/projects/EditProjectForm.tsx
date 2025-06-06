import { Link, useNavigate } from 'react-router-dom'
import ProjectForm from './ProjectForm'
import { Project, ProjectFormData } from '@/types/index'
import { useForm } from 'react-hook-form'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateProject } from '@/api/ProjectAPI'
import { toast } from 'react-toastify'

type EditProjectFormProps = {
    data: ProjectFormData
    projectId: Project['_id']
}
export default function EditProjectForm({data, projectId} : EditProjectFormProps) {
    const navigate = useNavigate()

    const { register, handleSubmit, formState: { errors } } = useForm({ defaultValues: {
        projectName: data.projectName,
        clientName: data.clientName,
        description: data.description
    } })

    const queryClient = useQueryClient() 

    const { mutate } = useMutation({
        mutationFn: updateProject,
        onError: (error) => {
            toast.error(error.message)

        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({queryKey: ['projects']}) //va a invalidar el querykey de projects para realizar una consulta nueva con los datos actualizados
                                                                    //(hace un refresh automatico)
            queryClient.invalidateQueries({queryKey: ['editProject', projectId]}) 
            toast.success(data)
            navigate('/')    
        }
    })

    const handleForm = (formData: ProjectFormData) => {
        const data = { //tenemos que crear un objeto pq react query no admite mas de un parametro
            formData,
            projectId
        }
        mutate(data) //tenemos que pasar
    }

    return (
        <>
            <div className="max-w-3xl mx-auto">
                <h1 className="text-5xl font-black">Editar Proyecto</h1>
                <p className="text-2xl font-light text-gray-500 mt-5">Llena el siguiente formulario para editar un proyecto</p>
                <nav className="my-5">
                    <Link
                        className="bg-cyan-800 hover:bg-cyan-900 px-10 py-3 text-black text-xl font bold cursor-pointer transition-colors"
                        to="/"
                    >Volver a Proyectos</Link>

                </nav>
                <form
                    className="bt-10 bg-white shadow-lg p-10 rounded-lg"
                    onSubmit={handleSubmit(handleForm)}
                    noValidate
                >
                    <ProjectForm
                        register={register}
                        errors={errors}
                    />
                    <input
                        type="submit"
                        value="Guardar Cambios"
                        className="bg-teal-600 hover:bg-teal-700 w-full p-3 text-white 
                uppercase font-bold cursor-pointer transition-colors"
                    />

                </form>
            </div>
        </>
    )
}
