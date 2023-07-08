import * as yup from 'yup';

export const refundClaimValidationSchema = yup.object().shape({
  claim_status: yup.string().required(),
  client_id: yup.string().nullable(),
});
