import { createCipheriv, createDecipheriv, pbkdf2Sync, randomBytes } from 'crypto';
import { MasterPassword } from '../interfaces/data';



export function encrypt(text: string, key: string): string {
    const keyBuffer=Buffer.from(key,"base64");
    const iv = randomBytes(16);
    const cipher = createCipheriv('aes-256-gcm', keyBuffer, iv);
    const encrypted = Buffer.concat([cipher.update(text, 'utf8'), cipher.final()]);
    const authTag=cipher.getAuthTag();
    return iv.toString('hex') + ':' + encrypted.toString('hex')+":"+authTag.toString("hex");
}

export function decrypt(encryptedText: string, key: string): string {
    const keyBuffer=Buffer.from(key,"base64");
    const [ivHex, contentHex,tagHex] = encryptedText.split(':');
    const iv = Buffer.from(ivHex, 'hex');
    const authTag = Buffer.from(tagHex, 'hex');
    const decipher = createDecipheriv('aes-256-gcm', keyBuffer, iv);
    decipher.setAuthTag(authTag)
    const decrypted = Buffer.concat([decipher.update(contentHex, 'hex'), decipher.final()]);
    return decrypted.toString('utf8');
}
