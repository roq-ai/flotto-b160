const mapping: Record<string, string> = {
  clients: 'client',
  contracts: 'contract',
  'refund-claims': 'refund_claim',
  users: 'user',
};

export function convertRouteToEntityUtil(route: string) {
  return mapping[route] || route;
}
