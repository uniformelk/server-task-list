import colors from 'colors'
import type { Request, Response } from "express"
import Project from "../models/Project";

export class ProjectController {
    
    static createProject = async (req: Request, res: Response) =>{
        const project = new Project(req.body)
        
        try {
            await project.save();
            res.send('Proyecto creado correctamente');
        } catch (error) {
            console.log(colors.red.bold(error))
        }
    }
    
    static getAllProjects = async (req: Request, res: Response) =>{
        try {
            const projects = await Project.find({})
            res.json(projects)
        } catch (error) {
            console.log(colors.red.bold(error))
        }
        res.send('Todos los proyectos');
    }

    static getProjectByID = async (req: Request, res: Response) =>{
        const { id } = req.params
        try {
            const project = await Project.findById(id)
            if(!project){
                const error = new Error('Proyecto no encontrado')
                res.status(404).json({error: error.message})
                return
            }
            res.json(project)
        } catch (error) {
            console.log(colors.red.bold(error))
        }
    }

    static updateProject = async (req: Request, res: Response) =>{
        const { id } = req.params
        try {
            const project = await Project.findByIdAndUpdate(id, req.body)

            if(!project){
                const error = new Error('Proyecto no encontrado')
                res.status(404).json({error: error.message})
                return
            }

            await project.save();
            res.send('Proyecto actualizado')
        } catch (error) {
            console.log(colors.red.bold(error))
        }
    }

    static deleteProject = async (req: Request, res: Response) =>{
        const { id } = req.params
        try {
            const project = await Project.findById(id)

            if(!project){
                const error = new Error('Proyecto no encontrado')
                res.status(404).json({error: error.message})
                return
            }
            await project.deleteOne()
            res.send('Proyecto eliminado')
        } catch (error) {
            console.log(colors.red.bold(error))
        }
    }

}