import { Signer } from "ethers";
import { Provider } from "@ethersproject/providers";
import type { EIP712Upgradeable, EIP712UpgradeableInterface } from "../EIP712Upgradeable";
export declare class EIP712Upgradeable__factory {
    static readonly abi: {
        anonymous: boolean;
        inputs: {
            indexed: boolean;
            internalType: string;
            name: string;
            type: string;
        }[];
        name: string;
        type: string;
    }[];
    static createInterface(): EIP712UpgradeableInterface;
    static connect(address: string, signerOrProvider: Signer | Provider): EIP712Upgradeable;
}
