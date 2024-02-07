import { Signer } from "ethers";
import { Provider } from "@ethersproject/providers";
import type { IUpgradeExecutor, IUpgradeExecutorInterface } from "../IUpgradeExecutor";
export declare class IUpgradeExecutor__factory {
    static readonly abi: {
        inputs: {
            internalType: string;
            name: string;
            type: string;
        }[];
        name: string;
        outputs: never[];
        stateMutability: string;
        type: string;
    }[];
    static createInterface(): IUpgradeExecutorInterface;
    static connect(address: string, signerOrProvider: Signer | Provider): IUpgradeExecutor;
}
