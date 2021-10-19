import { RunFunction } from "../../util/interfaces/Command";
import { Command } from '../../util/interfaces/Command'
import { Message } from "discord.js";

export const run: RunFunction = async (client, message: Message) => {
    if (message.author.bot ||
        !message.guild || 
        !message.content.toLowerCase().startsWith('t!')
        ) 
        return;
    
    const args: string[] = message.content.slice('t!'.length).trim().split(/ +/g);
    
    const cmd: string | undefined = args.shift();
    if (cmd === undefined) return;
    
    const command: Command | undefined = client.commands.get(cmd);
    if (command === undefined) return;
    
    command.run(client, message, args)
    .catch((reason: any) => console.log(reason))
}

export const name: string = 'messageCreate';