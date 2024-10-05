import { ERC20Token } from '../generated/ERC20Token/ERC20Token';
import { User, Token} from '../generated/schema'
import { Address, BigInt, Bytes } from "@graphprotocol/graph-ts";

export function loadOrCreateUser(id: string): User {
    let user = User.load(id);
    if (user === null) {
        user = new User(id);
        user.save();
    }

    return user;
}

export function loadOrCreateToken(tokenAddress: string):Token{
    let token = Token.load(tokenAddress);
    if (token === null) {
        token = new Token(tokenAddress);

        let address = Address.fromString(tokenAddress);

       let erc20 = ERC20Token.bind(address);
       let nameCall = erc20.try_name();
       let symbolCall = erc20.try_symbol();
       let totalSupplyCall = erc20.try_totalSupply();
        token.save();
    }

    return token as Token;
}