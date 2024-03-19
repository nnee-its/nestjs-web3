import { Injectable } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import { EnvPayload } from "src/types/env-payload"
import {
  PublicClient,
  WalletClient,
  createPublicClient,
  createWalletClient,
  http,
} from "viem"
import { privateKeyToAccount } from "viem/accounts"
import { bscTestnet } from "viem/chains"

@Injectable()
export class ClientService {
  readonly publicClient: PublicClient
  readonly walletClient: WalletClient

  constructor(private configService: ConfigService<EnvPayload>) {
    const account = privateKeyToAccount(
      this.configService.get("WALLET_CLIENT_PRIVATE_KEY"),
    )
    //@ts-ignore
    this.publicClient = createPublicClient({
      chain: bscTestnet,
      transport: http(),
    })
    this.walletClient = createWalletClient({
      account,
      chain: bscTestnet,
      transport: http(),
    })
  }
}
