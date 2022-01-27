import fs from 'fs';
import colors from 'colors';
import { Request } from "express";
colors.enable();

export async function logStartup() {
    await fs.promises.stat('log').catch(async () => {
        await fs.promises.mkdir('log');
        await logging(`Created 'log' Folder.`, ['info.cyan']);
    })
}

export async function logging(message: string, types: string[], req?: Request) {
    let messages = { console: message, file: message }
    types.slice().reverse().forEach(async (type) => {
        switch (type) {
            case 'info.green':
                messages.console = '[INFO] '.green + messages.console;
                messages.file = '[INFO] ' + messages.file;
                break;
            
            case 'info.cyan':
                messages.console = '[INFO] '.cyan + messages.console;
                messages.file = '[INFO] ' + messages.file;
                break;
            
            case 'debug':
                messages.console = '[Debug] '.grey + messages.console;
                messages.file = '[Debug] ' + messages.file;
                break;
            
            case 'post':
                messages.console = '[POST] ' + messages.console;
                messages.file = '[POST] ' + messages.file;
                break;
            
            case 'warn':
                messages.console = '[WARN] '.yellow + messages.console;
                messages.file = '[WARN] ' + messages.file;
                break;
            
            case 'error':
                messages.console = '[ERROR] '.red + messages.console;
                messages.file = '[ERROR] ' + messages.file;
                break;

            default:
                await logging('Invalid logging argument! The Argument was: ' + type, ['error']);
                break;
        }
    })
    messages.console = `[${new Date().toString().slice(0, 33)}] ` + messages.console;
    messages.file = `[${new Date().toString().slice(0, 33)}] ` + messages.file;
    if (req) {
        const ip = (req.header('x-forwarded-for') || '127.0.0.1, 192.168.178.1').split(',');
        messages.console = ip[0].yellow + ' - ' + messages.console;
        messages.file = ip[0] + ' - ' + messages.file;
    }
    await fs.promises.appendFile('log/log.txt', messages.file + '\n');
    console.log(messages.console);
}
