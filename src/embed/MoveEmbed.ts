import { Message, MessageEmbed } from "discord.js";
import { engToKor } from "../util/helper/nameTranslate";
import { CharData } from "../util/interfaces/CharData";
import path from 'path'

export const sendMoveEmbed = async (message: Message, charData: CharData, moveNum: number): Promise<void> => { 
    const thisMove = charData.moveList[moveNum - 1]
    
    const makeMoveListEmbed = (start: number): MessageEmbed => {
        const embed = new MessageEmbed()
            .setTitle(`${engToKor(charData.character)} - ${thisMove.command}`)
            .addField('커맨드', thisMove.command, true)
            .addField('판정', thisMove.hitLevel, true)
            .addField('데미지', thisMove.damage, true)
            .addField('발동 프레임', thisMove.startUp, true)
            .addField('가드시 프레임', thisMove.blockFrame, true)
            .addField('히트시 프레임', thisMove.hitFrame, true)
            .addField('카운터시 프레임', thisMove.counterFrame, true)
            .addField('비고', thisMove.notes ? thisMove.notes : 'None', true)
            .setImage(`attachment://wait.png`)
            .setAuthor('Tekky')
        
        return embed;
    }
        

    await message.channel.send({ embeds: [makeMoveListEmbed(0)], 
        files: [{attachment: path.resolve(__dirname, '../../data/img/wait.png'), name: `wait.png`}]})

}
