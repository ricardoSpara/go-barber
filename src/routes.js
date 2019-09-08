import { Router } from 'express';

import multer from 'multer';
import multerConfig from './config/multer';
import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import authMiddleware from './app/middlewares/auth';
import FileController from './app/controllers/FileController';
import ProviderController from './app/controllers/ProviderController';
import AppointmentController from './app/controllers/AppointmentController';
import ScheduleController from './app/controllers/ScheduleController';
import NotificationController from './app/controllers/NotificationController';
import AvailableController from './app/controllers/AvailableController';

import validateUserStore from './app/validators/UserStore';
import validateUserUpdate from './app/validators/UserUpdate';
import validateSessionStore from './app/validators/SessionStore';
import validateAppoitmentStore from './app/validators/AppoitmentStore';

const uploads = multer(multerConfig);
const routes = new Router();

routes.post('/sessions', validateSessionStore, SessionController.store);

routes.use(authMiddleware);

routes.put('/users', validateUserUpdate, UserController.update);
routes.post('/users', validateUserStore, UserController.store);

routes.post('/files', uploads.single('file'), FileController.store);

routes.get('/providers', ProviderController.index);
routes.get('/providers/:providerId/available', AvailableController.index);

routes.post(
  '/appointments',
  validateAppoitmentStore,
  AppointmentController.store
);
routes.get('/appointments', AppointmentController.index);
routes.delete('/appointments/:id', AppointmentController.destroy);

routes.get('/schedule', ScheduleController.index);

routes.get('/notification', NotificationController.index);
routes.put('/notification/:id', NotificationController.update);

export default routes;
