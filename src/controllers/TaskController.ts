import colors from 'colors'
import type { Request, Response } from "express";
import Tasks from '../models/Tasks';

export class TaskController {

    static createTask = async (req : Request, res: Response) => {
        try {
            const task = new Tasks(req.body)
            task.project = req.project.id
            req.project.tasks.push(task.id)
            await Promise.allSettled([
                task.save(),
                req.project.save()
            ])
            res.send('Tarea creada correctamente')
        } catch (error) {
            console.log(colors.red.bold(error))
            res.status(500).json({error: "Hubo un error"})
        }
    }

    static getProjectTasks = async (req : Request, res: Response) => {
        try {
            const tasks = await Tasks.find({project: req.project.id}).populate('project')
            res.json(tasks)
        } catch (error) {
            console.log(colors.red.bold(error))
            res.status(500).json({error: "Hubo un error"})
        }
    }

    static getTaskByID = async ( req: Request, res: Response ) => {
        try {
            const {taskId} = req.params
            const task = await Tasks.findById(taskId)
            if(!task){
                const error = new Error('Tarea no encontrada')
                res.status(404).json({error: error.message})
                return
            }
            if(task.project.toString() !== req.project.id){
                const error = new Error('Accion no valida')
                res.status(400).json({error: error.message})
                return
            }
            res.json(task)
        } catch (error) {
            console.log(colors.red.bold(error))
            res.status(500).json({error: "Hubo un error"})
        }
    }

    static updateTask = async (req: Request, res: Response) => {
        try {
            const {taskId} = req.params
            const task = await Tasks.findById(taskId)
            if(!task){
                const error = new Error('Tarea no encontrada')
                res.status(404).json({error: error.message})
                return
            }
            if(task.project.toString() !== req.project.id){
                const error = new Error('Accion no valida')
                res.status(400).json({error: error.message})
                return
            }
            task.name = req.body.name
            task.description = req.body.description
            await task.save()
            res.send('Tarea Actualizada correctamente');
        } catch (error) {
            console.log(colors.red.bold(error))
            res.status(500).json({error: "Hubo un error"})
        }
    }

    static deleteTask = async (req: Request, res: Response) => {
        try {
            const {taskId} = req.params
            const task = await Tasks.findById(taskId)
            if(!task){
                const error = new Error('Tarea no encontrada')
                res.status(404).json({error: error.message})
                return
            }
            if(task.project.toString() !== req.project.id){
                const error = new Error('Accion no valida')
                res.status(400).json({error: error.message})
                return
            }
            req.project.tasks = req.project.tasks.filter( task => task.toString() !== taskId)

            await Promise.allSettled([
                task.deleteOne(),
                req.project.save()
            ])
            res.send('Tarea eliminada correctamente')
        } catch (error) {
            console.log(colors.red.bold(error))
            res.status(500).json({error: "Hubo un error"})
        }
    }

}