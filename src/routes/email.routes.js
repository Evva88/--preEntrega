import { Router } from "express";
import { sendEmail, sendEmailWithAttachments, sendPasswordRecoveryEmail } from '../controllers/messages.controller.js';

const emailRouter = Router();

emailRouter.get("/", sendEmail);
emailRouter.get("/attachments", sendEmailWithAttachments);

// Ruta para enviar enlaces de restauración de contraseña
emailRouter.post("/api/email/sendRestoreLink", sendPasswordRecoveryEmail);

export default emailRouter;

