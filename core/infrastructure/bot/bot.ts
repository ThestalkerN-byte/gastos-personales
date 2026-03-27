import { Bot } from "grammy";
import { SupabaseGastoRepository } from "../repositories/SupabaseGastoRepository";
import { CreateGasto } from "@/core/application/uses-cases/CreateGasto";
import { SupabaseCategoriaRepository } from "../repositories/SupabaseCategoriaRepository";
import { GetCategorias } from "@/core/application/uses-cases/GetCategorias";

const bot = new Bot(process.env.TELEGRAM_BOT_TOKEN!)

const createGastoRepository = new SupabaseGastoRepository()
const createGastoUseCase = new CreateGasto(createGastoRepository)

const categoriasRepository = new SupabaseCategoriaRepository()
const getCategoriasUseCase = new GetCategorias(categoriasRepository)

bot.on('message', async (ctx) => {
    console.log("Message received")
    console.log("Message:", ctx.message)
})
bot.command('gasto', async (ctx) => {
    console.log("Gasto command received")
    const categorias = await getCategoriasUseCase.execute()
    console.log("Categorias fetched")
    console.log("Categorias:", categorias)
    const [, montoStr, categoriaStr ,...motivoStr] = ctx.message?.text?.split(" ") || [];
    console.log("Monto:", montoStr)
    console.log("Categoria:", categoriaStr)
    console.log("Motivo:", motivoStr)
    const monto =parseFloat(montoStr)
    const categoriaValida = categorias.find((c)=> c.nombre.toLowerCase() === categoriaStr.toLowerCase())
    const motivo = motivoStr.join(" ")
    console.log("Categoria valida:", categoriaValida)
    if(!categoriaValida){
        await ctx.reply("Categoria no encontrada")
        return
    }
    if(isNaN(monto)){
        await ctx.reply("Monto no valido")
        return
    }
    if(!motivo){
        await ctx.reply("Motivo no valido")
        return
    }
    const gasto = await createGastoUseCase.execute({
        monto,
        categoria_id: categoriaValida.id,
        motivo,
        usuario_id: ctx.from?.id.toString() || "",
    })
    await ctx.reply("Gasto creado correctamente")
})
export default bot