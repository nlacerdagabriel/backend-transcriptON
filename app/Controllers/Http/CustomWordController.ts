import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import { schema } from "@ioc:Adonis/Core/Validator";
import CustomWord from "App/Models/CustomWord";

export default class CustomWordController {
  public async store({ request, response }: HttpContextContract) {
    const wordSchema = schema.create({
      from: schema.string({ trim: true }),
      to: schema.string({ trim: true }),
    });

    let { from, to } = await request.validate({ schema: wordSchema });

    const existingCustomWord = await CustomWord.findBy("from", from);

    if (existingCustomWord) {
      return response.status(400).json(`A palavra "${from}" já foi usada.`);
    }

    if (to.includes(" ")) {
      to = to.split(" ").join("@");
    }

    const customWord = CustomWord.create({ from, to });

    return response.json(customWord);
  }

  public async getAll({ response }: HttpContextContract) {
    const customWords = await CustomWord.all();

    return response.json(customWords);
  }

  public async getOne({ response, params }: HttpContextContract) {
    const customWord = await CustomWord.find(params.id);

    return response.json(customWord);
  }

  public async updateOne({ request, response, params }: HttpContextContract) {
    const wordSchema = schema.create({
      from: schema.string({ trim: true }),
      to: schema.string({ trim: true }),
    });

    let { from, to } = await request.validate({ schema: wordSchema });

    if (to.includes(" ")) {
      to = to.split(" ").join("@");
    }

    const customWord = await CustomWord.findOrFail(params.id);
    
    customWord.from = from;
      customWord.to = to;

    const updatedWord = await customWord.save();

    return response.json(updatedWord);
  }

  public async deleteOne({ response, params }: HttpContextContract) {
    const customWord = await CustomWord.findOrFail(params.id);

    const deletedWord = await customWord.delete();

    return response.json(deletedWord);
  }
}
