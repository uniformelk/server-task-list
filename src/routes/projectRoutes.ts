import { Router } from 'express';
import { body, param} from 'express-validator'
import { ProjectController } from '../controllers/ProjectController';
import { handleInputErrors } from '../middleware/validation';
import { TaskController } from '../controllers/TaskController';
import { validateProjectExist } from '../middleware/project';

const router = Router()

router.post('/', 
    body('projectName').notEmpty().withMessage('El nombre del proyecto es obligatorio'),
    body('clientName').notEmpty().withMessage('El nombre del cliente es obligatorio'),
    body('description').notEmpty().withMessage('La descripción del proyecto es obligatoria'),
    handleInputErrors,
    ProjectController.createProject
)

router.get('/', ProjectController.getAllProjects)

router.get('/:id', 
    param('id').isMongoId().withMessage('ID no Valido'),
    handleInputErrors,
    ProjectController.getProjectByID
)

router.put('/:id', 
    param('id').isMongoId().withMessage('ID no Valido'),
    body('projectName').notEmpty().withMessage('El nombre del proyecto es obligatorio'),
    body('clientName').notEmpty().withMessage('El nombre del cliente es obligatorio'),
    body('description').notEmpty().withMessage('La descripción del proyecto es obligatoria'),
    handleInputErrors,
    ProjectController.updateProject
)

router.delete('/:id',
    param('id').isMongoId().withMessage('ID no Valido'),
    handleInputErrors,
    ProjectController.deleteProject
)

/*Routes for tasks*/
router.param('projectID', validateProjectExist)

router.post('/:projectID/tasks',
    body('name').notEmpty().withMessage('El nombre de la tarea es obligatorio'),
    body('description').notEmpty().withMessage('La descripción de la tarea es obligatoria'),
    handleInputErrors,
    TaskController.createTask
)

router.get('/:projectID/tasks',
    TaskController.getProjectTasks
)

router.get('/:projectID/tasks/:taskId',
    param('taskId').isMongoId().withMessage('ID no valido'),
    TaskController.getTaskByID
)

router.put('/:projectID/tasks/:taskId',
    param('taskId').isMongoId().withMessage('ID no valido'),
    body('name').notEmpty().withMessage('El nombre de la tarea es obligatorio'),
    body('description').notEmpty().withMessage('La descripción de la tarea es obligatoria'),
    handleInputErrors,
    TaskController.updateTask
)

router.delete('/:projectID/tasks/:taskId',
    param('taskId').isMongoId().withMessage('ID no valido'),
    TaskController.deleteTask
)

export default router;