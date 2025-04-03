import api from "@/lib/axios";
import { dashboardProjectSchema, editProjectSchema, Project, ProjectFormData, projectSchema } from "../types";
import { isAxiosError } from "axios";

export async function createProject(formData : ProjectFormData){
    try {
        const { data } = await api.post('/projects', formData)
        return (data)
    } catch (error) {
        if(isAxiosError(error) && error.response){
            throw new Error(error.response.data.error) //lanzamos un error para que lo detecte useMutation
        }
    }
}

export async function getProjects(){
    try {
        const { data } = await api('/projects') //no ponemos get pq es default 
        const response = dashboardProjectSchema.safeParse(data)
        console.log(response)
        if(response.success){
            return response.data
        }

    } catch (error) {
        if(isAxiosError(error) && error.response){
            throw new Error(error.response.data.error) //lanzamos un error para que lo detecte useMutation
        }
    }
}

export async function getProjectById(id: Project['_id']){
    try {
        const { data } = await api(`/projects/${id}`)
        const response = editProjectSchema.safeParse(data)
        if(response.success){
            return response.data
        }
    } catch (error) {
        if(isAxiosError(error) && error.response){
            throw new Error(error.response.data.error) //lanzamos un error para que lo detecte useMutation
        }
    }
}
export async function getFullProject(id: Project['_id']){
    try {
        const { data } = await api(`/projects/${id}`)
        const response = projectSchema.safeParse(data)
        if(response.success){
            return response.data
        }
    } catch (error) {
        if(isAxiosError(error) && error.response){
            throw new Error(error.response.data.error) //lanzamos un error para que lo detecte useMutation
        }
    }
}

type ProjectAPIType = {
    formData: ProjectFormData,
    projectId: Project['_id']
}

export async function updateProject({formData, projectId} : ProjectAPIType){
    try {
        const { data } = await api.put<string>(`/projects/${projectId}`, formData) //definimos un generic para definir que esperamos un string
                                                                                    //es mejor que solo las peticiones GET tengan un schema zod
        return data
    } catch (error) {
        if(isAxiosError(error) && error.response){
            throw new Error(error.response.data.error) //lanzamos un error para que lo detecte useMutation
        }
    }
}

export async function deleteProject(id: Project['_id']){
    try {
        const { data } = await api.delete<string>(`/projects/${id}`)
        return data
    } catch (error) {
        if(isAxiosError(error) && error.response){
            throw new Error(error.response.data.error) //lanzamos un error para que lo detecte useMutation
        }
    }
}
