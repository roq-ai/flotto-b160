import { ClientInterface } from 'interfaces/client';
import { GetQueryInterface } from 'interfaces';

export interface ContractInterface {
  id?: string;
  provider_name: string;
  contract_details: string;
  client_id?: string;
  created_at?: any;
  updated_at?: any;

  client?: ClientInterface;
  _count?: {};
}

export interface ContractGetQueryInterface extends GetQueryInterface {
  id?: string;
  provider_name?: string;
  contract_details?: string;
  client_id?: string;
}
