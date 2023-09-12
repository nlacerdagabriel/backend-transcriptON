import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import { schema, rules } from "@ioc:Adonis/Core/Validator";
import User from "App/Models/User";

export default class UsersController {
  public async login({ request, response, auth }: HttpContextContract) {
    const loginSchema = schema.create({
      email: schema.string({ trim: true }, [rules.email()]),
      password: schema.string({}, [rules.minLength(4)]),
    });

    const { email, password } = await request.validate({ schema: loginSchema });

    const user = await User.findBy("email", email);

    try {
      const token = await auth.use("api").attempt(email, password, {
        expiresIn: "7 days",
      });

      if (user !== null) {
        const { id } = user;

        return response.json({
          user: {
            id,
            email,
          },
          token: token.token,
        });
      }
    } catch {
      return response.unauthorized("Invalid credentials");
    }
  }

  public async logout({ response, auth }: HttpContextContract) {
    try {
      await auth.use("api").revoke();

      return response.json({ success: "User logged out" });
    } catch (error) {
      return response.json(error);
    }
  }
}
