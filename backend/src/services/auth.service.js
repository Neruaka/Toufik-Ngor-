const { generateToken } = require("../utils/jwt.utils");
const { comparePassword,hashPassword } = require("../utils/password.utils");
const User = require('../models/users.model');

exports.CreateUser = async ({ email, username, password }) => {
    try {
        // Vérification de l'existance d'un utilisateur identique (email et/ou username)
        const isExist = await User.find({$or :[{username:username},{email:email}]});

        if (isExist.length > 0) {
            return { error: true, message: "Utilisateur déjà existant", statusCode: 400 };
        }

        const hashedPassword = await hashPassword(password);

        const userData = {
            email,
            username,
            password: hashedPassword
        }

        await User.create(userData);

        return { error: false, message: "Votre compte a bien été créé", statusCode: 201 }
    } catch (error) {
        console.error("SERVICE::USERS::CreateUser - ", error);
        return { error: true, message: "Une erreur est survenue lors de la création de votre compte, veuillez réessayer plus tard.", statusCode: 500 }
    }
}

exports.SignIn = async ({ identifier, password }) => {
  try {
    const emailRegex = /[A-Z0-9._%+-]+@[A-Z0-9-]+.+.[A-Z]{2,4}/gim;

    let user;
    if (emailRegex.test(identifier)) {
      user = await User.findOne({email : identifier});
    } else {
      user = await User.findOne({ username: { $regex: `^${identifier}$`, $options: "i" } });
    }
    if (!user) {
      return {
        error: true,
        message: "Identifiant et/ou mot de passe incorrect",
        statusCode: 400,
      };
    }

    const isPasswordValid = await comparePassword(password, user.password);

    if (!isPasswordValid) {
      return {
        error: true,
        message: "Identifiant et/ou mot de passe incorrect",
        statusCode: 400,
      };
    }

    // Convertir l'objet Mongoose en objet plain et retirer le password
    const userObject = user.toObject();
    delete userObject.password;

    const token = generateToken({ 
      userId: userObject._id,
      email: userObject.email,
      username: userObject.username
    });

    if (!token) {
      throw new Error("Erreur lors de la création d'un token utilisateur.");
    }

    return {
      error: false,
      message: "Connexion effectuée",
      statusCode: 200,
      data: { 
        token,
        user: userObject
      }
    };
  } catch (error) {
    console.error("SERVICE::AUTH::SignIn - ", error);
    return {
      error: true,
      message:
        "Une erreur est survenue lors de la connexion à votre compte, veuillez réessayer plus tard.",
      statusCode: 500,
    };
  }
};
