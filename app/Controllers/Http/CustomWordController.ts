import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema } from '@ioc:Adonis/Core/Validator'
import CustomWord from 'App/Models/CustomWord'


export default class CustomWordController {
  public async store({ request, response }: HttpContextContract) {
    const wordSchema = schema.create({
      from: schema.string({ trim: true }),
      to: schema.string({ trim: true }),
    })

    const { from, to } = await request.validate({ schema: wordSchema })

    const existingCustomWord = await CustomWord.findBy('from', from)

    if(existingCustomWord){
      return response.status(400).json(`A palavra "${from}" já foi usada.`)
    }


    const customWord = CustomWord.create({ from, to })

    return response.json(customWord)
  }

  public async getAll({request, response }: HttpContextContract) {
    const customWords = await CustomWord.all()

    return response.json(customWords)
  }

  public async getOne({request, response, params }: HttpContextContract) {
    const customWord = await CustomWord.find(params.id)

    return response.json(customWord)
  }


  public async updateOne({request, response, params}: HttpContextContract){

    const wordSchema = schema.create({
      from: schema.string({ trim: true }),
      to: schema.string({ trim: true }),
    })

    const { from, to } = await request.validate({ schema: wordSchema })

    const customWord = await CustomWord.findOrFail(params.id)
    customWord.from = from
    customWord.to = to

    const updatedWord = await customWord.save()

    return response.json(updatedWord)
  }

  public async deleteOne({request, response, params}: HttpContextContract){

    const customWord = await CustomWord.findOrFail(params.id)

    const deletedWord = await customWord.delete()

    return response.json(deletedWord)
  }
}
