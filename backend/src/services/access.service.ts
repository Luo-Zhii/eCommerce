import shopModel from "../models/shop.model";
import { genSaltSync, hashSync } from "bcrypt-ts";
import { generateKeyPairSync } from 'crypto';
import { IShop } from "../interface/interface";

const RoleShop = {
    SHOP: 'SHOP',
    WRITER: 'WRITER',
    ADMIN: 'ADMIN',
    EDITOR: 'EDITOR',
}

class AccessService {
    
    async signUp({ name, email, password }: IShop ) {
        try {
            // Check if the email already exists
            const holderShop = await shopModel.find({ email }).lean();
            if (holderShop) {
                return {
                    code: 'xxx',
                    message: "Email already exists",
                }
            }
            // Hash the password

            const salt = genSaltSync(10);
            

            const hashedPassword = hashSync(password, salt);
            const newShop = await shopModel.create({
                name,
                email,
                password: hashedPassword,
                role: RoleShop.SHOP,
            });
            if (newShop) {
                const {privateKey, publicKey} = generateKeyPairSync('rsa', {
                    modulusLength: 4096,
                });
                console.log({privateKey, publicKey})
            }
            return { message: "Shop registered successfully" };
        } catch (error) {
            return {
                code: 'xxx',
                message: error instanceof Error ? error.message : "An unknown error occurred",
                
            }
        }
    }
}

const accessService = new AccessService();
export default accessService;