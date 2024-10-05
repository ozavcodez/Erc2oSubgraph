import { BigInt } from "@graphprotocol/graph-ts";
import {
  Approval ,
  Transfer 
} from "../generated/ERC20Token/ERC20Token"
import { Balance , Approval as ApprovalEntity} from "../generated/schema"
import { loadOrCreateToken, loadOrCreateUser } from "./utils"



// Handler for Transfer events
export function handleTransfer(event: Transfer): void {
  let sender = loadOrCreateUser(event.params.from.toHexString());
  let recipient = loadOrCreateUser(event.params.to.toHexString());
  let token = loadOrCreateToken(event.address.toHexString());

  let senderBalanceId = event.params.from
    .toHexString()
    .concat("-")
    .concat(event.address.toHexString());

  let senderBalance = Balance.load(senderBalanceId);
  if (senderBalance == null) {
    senderBalance = new Balance(senderBalanceId);
    senderBalance.user = sender.id;
    senderBalance.token = token.id;
    senderBalance.balance = BigInt.fromI32(0); 
  }
  senderBalance.balance = senderBalance.balance.minus(event.params.amount);
  senderBalance.timestamp = event.block.timestamp;
  senderBalance.transactionHash = event.transaction.hash;
  senderBalance.save();

  // Update recipient's balance
  let recipientBalanceId = event.params.to
    .toHexString()
    .concat("-")
    .concat(event.address.toHexString());

  let recipientBalance = Balance.load(recipientBalanceId);
  if (recipientBalance == null) {
    recipientBalance = new Balance(recipientBalanceId);
    recipientBalance.user = recipient.id;
    recipientBalance.token = token.id;
    recipientBalance.balance = BigInt.fromI32(0); // Initialize balance
  }
  recipientBalance.balance = recipientBalance.balance.plus(event.params.amount);
  recipientBalance.timestamp = event.block.timestamp;
  recipientBalance.transactionHash = event.transaction.hash;
  recipientBalance.save();
}

export function handleApproval(event: Approval): void {
  let owner = loadOrCreateUser(event.params.owner.toHexString());
  let spender = loadOrCreateUser(event.params.spender.toHexString());
  let token = loadOrCreateToken(event.address.toHexString());

  // Create a unique identifier for the approval (owner + spender + token)
  let approvalId = event.params.owner
    .toHexString()
    .concat("-")
    .concat(event.params.spender.toHexString())
    .concat("-")
    .concat(event.address.toHexString());

  let approval = ApprovalEntity.load(approvalId);
  if (approval == null) {
    approval = new ApprovalEntity(approvalId);
    approval.owner = owner.id;
    approval.spender = spender.id;
    approval.token = token.id;
  }
  approval.amount = event.params.amount;
  approval.timestamp = event.block.timestamp;
  approval.transactionHash = event.transaction.hash;
  approval.save();
}


// Build completed: QmQqfrCo8WURz19H1kGzKgj1enqz58MzRVTjhRddh6vt5h

// Deployed to https://thegraph.com/studio/subgraph/erc20

// Subgraph endpoints:
// Queries (HTTP):     https://api.studio.thegraph.com/query/90773/erc20/v0.0.1
