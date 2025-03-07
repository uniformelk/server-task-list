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
        }
    }

}