import { Message, MessageEmbed, MessageReaction, User } from "discord.js";
import { isNumeric } from "../util/helper/isNumeric";
import { engToKor } from "../util/helper/nameTranslate";
import { CharData } from "../util/interfaces/CharData";
import { sendMoveListEmbed } from "./MoveListEmbed";

const PGSIZE = 10

export const sendCharListEmbed = async (message: Message, charList: Array<CharData>): Promise<void> => { 
    let start = 0

    const makeCharListEmbed = (start: number): MessageEmbed => {
        const embed = new MessageEmbed()
            .setTitle('캐릭터 목록')
            .setFooter('자세한 정보를 알고 싶으면 캐릭터 번호를 입력하세요')
            .setAuthor('Tekky')
            .setColor("DARK_OR")
            .addFields(...charList.map((char, index) => {
                return {name: `${index + 1}. ${engToKor(char.character)}`, value: '\u200B'}
            }).slice(PGSIZE * start, PGSIZE * (start + 1)))
        
        return embed;
    }
        

    const response = await message.channel.send({ embeds: [makeCharListEmbed(0)] })
        .then((res) => { res.react('⬅️'); return res })
        .then((res) => { res.react('➡️'); return res })

    const reactionFilter = (reaction: MessageReaction, user: User) => {
        return ['⬅️', '➡️'].includes(reaction.emoji.name!) && user.id === message.author.id
    };

    const reactionCollector = response.createReactionCollector({filter: reactionFilter, time: 90000 })
    reactionCollector.on('collect', (reaction, user) => {
        if (reaction.emoji.name === '⬅️'){
            if (start > 0) start -= 1;
            response.edit({embeds: [makeCharListEmbed(start)]})
            reaction.users.remove(user)
        }
        else if (reaction.emoji.name === '➡️'){
            if ( PGSIZE * (start + 1) < charList.length) start += 1;
            response.edit({ embeds: [makeCharListEmbed(start)] })
            reaction.users.remove(user);
        }
    })

    const messageFilter = (m: Message) => isNumeric(m.content)
    const messageCollector = message.channel.createMessageCollector({ filter: messageFilter, time: 90000, max: 1 })
    messageCollector.on('collect', async m => {
        const charNum: number = parseInt(m.content)
        
        if (charNum > charList.length + 1)
            await message.channel.send('없는 번호의 기술입니다.')
        else
            await sendMoveListEmbed(message, charList[charNum - 1])
    })
}