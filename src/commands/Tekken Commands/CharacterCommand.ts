import { RunFunction } from "../../util/interfaces/Command";
import { promises } from "fs";
import path from 'path'
import { CharData } from "../../util/interfaces/CharData";
import { sendMoveListEmbed } from "../../embed/MoveListEmbed";
import { korToEng } from "../../util/helper/nameTranslate";
import { sendCharListEmbed } from "../../embed/CharListEmbed";

export const run: RunFunction = async (client, message) => {
    const moveData: Array<CharData> = JSON.parse(
        await (await promises.readFile(path.resolve(__dirname, '../../../data/movedata.json'))).toString()
    )!

    const charEmbed = client.embed({}, message)

    const charName: string | undefined = message.content.slice('t!'.length).trim().split(/ +/g)[1]
    if (charName === undefined) {
        await sendCharListEmbed(message, moveData);
        return;
    }
    
    const charData: CharData | undefined = moveData.find((charData => charData.character == korToEng(charName)))
    if (charData === undefined) {
        charEmbed
            .setTitle("오류")
            .setColor("RED")
            .setDescription("올바른 캐릭터 이름을 입력해 주세요");
        
        await message.channel.send({ embeds: [charEmbed] });
        return;
    }

    await sendMoveListEmbed(message, charData)
}

export const name: string = 'char';