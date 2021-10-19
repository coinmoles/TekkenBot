import { Message, MessageEmbed, MessageReaction, User } from "discord.js";
import { isNumeric } from "../util/helper/isNumeric";
import { engToKor } from "../util/helper/nameTranslate";
import { CharData } from "../util/interfaces/CharData";
import { sendMoveEmbed } from "./MoveEmbed";

const PGSIZE = 10

export const sendMoveListEmbed = async (message: Message, charData: CharData): Promise<void> => { 
    let start = 0

    const makeMoveListEmbed = (start: number): MessageEmbed => {
        const embed = new MessageEmbed()
            .setTitle(engToKor(charData.character))
            .setThumbnail(`attachment://${charData.character.split('-').join(' ')}.png`)
            .setFooter('자세한 정보를 알고 싶으면 기술 번호를 입력하세요')
            .setAuthor('Tekky')
            .addFields(...charData.moveList.map((move, index) => {
                return {name: `${index + 1}. ${move.command}`, value: `발동: ${move.startUp}, 판정: ${move.hitLevel}, 히트시: ${move.hitFrame}, 가드시: ${move.blockFrame}`}
            }).slice(PGSIZE * start, PGSIZE * (start + 1)))
        
        return embed;
    }
        

    const response = await message.channel.send({ embeds: [makeMoveListEmbed(0)], 
        files: [{attachment: charData.imgSrc, name: `${charData.character}.png`}]  })
        .then((res) => { res.react('⬅️'); return res })
        .then((res) => { res.react('➡️'); return res })

    const reactionFilter = (reaction: MessageReaction, user: User) => {
        return ['⬅️', '➡️'].includes(reaction.emoji.name!) && user.id === message.author.id
    };

    const reactionCollector = response.createReactionCollector({filter: reactionFilter, time: 90000 })
    reactionCollector.on('collect', (reaction, user) => {
        if (reaction.emoji.name === '⬅️'){
            if (start > 0) start -= 1;
            response.edit({embeds: [makeMoveListEmbed(start)]})
            reaction.users.remove(user)
        }
        else if (reaction.emoji.name === '➡️'){
            if ( PGSIZE * (start + 1) < charData.moveList.length) start += 1;
            response.edit({ embeds: [makeMoveListEmbed(start)] })
            reaction.users.remove(user);
        }
    })

    const messageFilter = (m: Message) => isNumeric(m.content)
    const messageCollector = message.channel.createMessageCollector({ filter: messageFilter, time: 90000, max: 1 })
    messageCollector.on('collect', async m => {
        const moveNum: number = parseInt(m.content)
        
        if (moveNum > charData.moveList.length + 1)
            await message.channel.send('없는 번호의 기술입니다.')
        else
            await sendMoveEmbed(message, charData, moveNum)
    })
}