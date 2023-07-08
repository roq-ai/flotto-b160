import axios from 'axios';
import queryString from 'query-string';
import { RefundClaimInterface, RefundClaimGetQueryInterface } from 'interfaces/refund-claim';
import { GetQueryInterface } from '../../interfaces';

export const getRefundClaims = async (query?: RefundClaimGetQueryInterface) => {
  const response = await axios.get(`/api/refund-claims${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createRefundClaim = async (refundClaim: RefundClaimInterface) => {
  const response = await axios.post('/api/refund-claims', refundClaim);
  return response.data;
};

export const updateRefundClaimById = async (id: string, refundClaim: RefundClaimInterface) => {
  const response = await axios.put(`/api/refund-claims/${id}`, refundClaim);
  return response.data;
};

export const getRefundClaimById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/refund-claims/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteRefundClaimById = async (id: string) => {
  const response = await axios.delete(`/api/refund-claims/${id}`);
  return response.data;
};
