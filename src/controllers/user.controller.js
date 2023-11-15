import UserService from "../services/user.service.js";
import UserResponse from "../dao/dtos/user.response.js";
import { generateUserError } from "../services/errors/errorMessages/user.creation.error.js";
import EErrors from "../services/errors/errorsEnum.js";
import CustomError from "../services/errors/customError.js";
import { createHash } from "../midsIngreso/bcrypt.js";


class UserController {
  constructor() {
    this.userService = new UserService();
  }
  async register(req, res, next) {
    try {
      const { first_name, last_name, email, age, password, role } = req.body;

      // Verificar si el usuario es premium
      const isPremium = req.body.isPremium || false;

      if (!first_name || !email || !age || !password) {
        const customError = new CustomError({
          name: "User creation error",
          cause: generateUserError({
            first_name, last_name, email, age, password,
          }),
          message: "Error al intentar registrar al usuario",
          code: 400,
        });
        return next(customError);
      }
     
      const response = await this.userService.registerUser({
        first_name,
        last_name,
        email,
        age,
        password,
        role,
        isPremium, // Pasar la información de usuario premium al servicio
      });

      return res.status(response.status === "success" ? 200 : 400).json({
        status: response.status,
        data: response.user,
        redirect: response.redirect,
      });
    } catch (error) {
      return next(error);
    }
  }


  async becomePremium(req, res, next) {
    try {
      const userId = req.session.user.id;
      const userService = this?.userService; // Verificar si this.userService está definido
  
      if (!userService) {
        throw new Error("userService is undefined"); // Lanzar un error personalizado si no está definido
      }
  
      // Lógica para actualizar el usuario a premium
      const updatedUser = await userService.becomePremium(userId);
  
      // Actualiza la sesión del usuario
      req.session.user = updatedUser;
  
      return res.status(200).json({ message: '¡Ahora eres Premium!' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Error interno del servidor' });
    }
  }
  showBecomePremiumView(req, res) {
    res.render('becomePremium'); 
  }

async restorePassword(req, res, next) {
  
  try {
    const { user, pass } = req.query;
    const passwordRestored = await this.userService.restorePassword(user, createHash(pass));
    if (passwordRestored) {
      return res.send({status: "OK", message: "La contraseña se ha actualizado correctamente"});
    } else {
      const customError = new CustomError({
        name: "Restore Error",
        message: "No fue posible actualizar la contraseña",
        code: EErrors.PASSWORD_RESTORATION_ERROR,
      });
      return next(customError);  
    }
  } catch (error) {
    req.logger.error(error);
    return next(error);
  }
}
  currentUser(req, res, next) {
    if (req.session.user) {
      return res.send({
        status: "OK",
        payload: new UserResponse(req.session.user),
      });
    } else {
      const customError = new CustomError({
        name: "Auth Error",
        massage: "No fue posible acceder a Current",
        code: EErrors.AUTHORIZATION_ERROR,
      });
      return next(customError);  
    }
  }
}

const userService = new UserService();
const userController = new UserController(userService);

export default UserController;
