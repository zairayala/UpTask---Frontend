import { Project, TaskProject, TaskStatus } from "@/types/index"
import TaskCard from "./TaskCard"
import { statusTranslations } from "@/locales/es"
import DropTask from "./DropTask"
import { DndContext, DragEndEvent } from "@dnd-kit/core"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { updateStatus } from "@/api/TaskAPI"
import { toast } from "react-toastify"
import { useParams } from "react-router-dom"

type TaskListProps = {
    tasks: TaskProject[]
    canEdit: boolean
}
const initialStatusGroups: GroupTasks = {
    pending: [],
    onHold: [],
    inProgress: [],
    underReview: [],
    completed: []
}
type GroupTasks = {
    [key: string]: TaskProject[]
}


const statusStyles: { [key: string]: string } = {
    pending: 'border-t-slate-500',
    onHold: 'border-t-red-500',
    inProgress: 'border-t-blue-500',
    underReview: 'border-t-amber-500',
    completed: 'border-t-emerald-500'
}
export default function TaskList({ tasks, canEdit }: TaskListProps) {
    const params = useParams()
    const projectId = params.projectId!
    const groupedTasks = tasks.reduce((acc, task) => {
        let currentGroup = acc[task.status] ? [...acc[task.status]] : []; //vemos si hay tareas en el status actual
        currentGroup = [...currentGroup, task] //agregamos la tarea al grupo actual
        return { ...acc, [task.status]: currentGroup }; //asigna una clave status para el grupo actual al que pertenece mas todo el contenido previo
    }, initialStatusGroups);

    const queryClient = useQueryClient()
    const { mutate } = useMutation({
        mutationFn: updateStatus,
        onError: (error) => {
            toast.error(error.message)
        },
        onSuccess: (data) => {
            toast.success(data)
            queryClient.invalidateQueries({ queryKey: ['project', projectId] }) //queremos cambiar/recargar el proyecto en la interfaz
        }
    })

    const handleDragEnd = (e: DragEndEvent) => {
        const { over, active } = e

        if (over && over.id) {
            const taskId = active.id.toString();
            const status = over.id as TaskStatus;
            mutate({ projectId, taskId, status });
            queryClient.setQueryData(['project', projectId], (prevData : Project) => { //ingresamos el query que estamos usando
                console.log(prevData)
                const updatedTasks = prevData.tasks.map((task) => {
                    if (task._id === taskId) { //buscamos la tarea que estamos activando
                        return {
                            ...task,
                            status //retornamos la tarea actualizada con el status 
                        }
                    }
                    return task //si no es la tarea la retorna como esta
                })
                return {
                    ...prevData,
                tasks: updatedTasks //retornamos los datos previos mas las tareas actualizadas
                
                }
            }) //agregar datos adicionales para no esperar a la actualizacion
        }
    }
    return (
        <>
            <h2 className="text-5xl font-black my-10">Tareas</h2>

            <div className='flex gap-5 overflow-x-scroll 2xl:overflow-auto pb-32'>
                <DndContext onDragEnd={handleDragEnd} >
                    {Object.entries(groupedTasks).map(([status, tasks]) => ( //object.entries convierte un objeto en array
                        <div key={status} className='min-w-[300px] 2xl:min-w-0 2xl:w-1/5'>
                            <h3
                                className={`capitalize text-xl font-light border
                         border-slate-300 bg-white p-3 border-t-8 ${statusStyles[status]}`}>{statusTranslations[status]}</h3>
                            <DropTask status={status} />
                            <ul className='mt-5 space-y-5'>
                                {tasks.length === 0 ? (
                                    <li className="text-gray-500 text-center pt-3">No Hay tareas</li>
                                ) : (
                                    tasks.map(task => <TaskCard key={task._id} task={task} canEdit={canEdit} />)
                                )}
                            </ul>
                        </div>
                    ))}
                </DndContext>
            </div>

        </>
    )
}
