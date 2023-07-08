import { ContractInterface } from 'interfaces/contract';
import { RefundClaimInterface } from 'interfaces/refund-claim';
import { UserInterface } from 'interfaces/user';
import { GetQueryInterface } from 'interfaces';

export interface ClientInterface {
  id?: string;
  description?: string;
  image?: string;
  name: string;
  created_at?: any;
  updated_at?: any;
  user_id: string;
  tenant_id: string;
  contract?: ContractInterface[];
  refund_claim?: RefundClaimInterface[];
  user?: UserInterface;
  _count?: {
    contract?: number;
    refund_claim?: number;
  };
}

export interface ClientGetQueryInterface extends GetQueryInterface {
  id?: string;
  description?: string;
  image?: string;
  name?: string;
  user_id?: string;
  tenant_id?: string;
}