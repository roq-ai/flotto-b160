import { ClientInterface } from 'interfaces/client';
import { GetQueryInterface } from 'interfaces';

export interface RefundClaimInterface {
  id?: string;
  claim_status: string;
  client_id?: string;
  created_at?: any;
  updated_at?: any;

  client?: ClientInterface;
  _count?: {};
}

export interface RefundClaimGetQueryInterface extends GetQueryInterface {
  id?: string;
  claim_status?: string;
  client_id?: string;
}
