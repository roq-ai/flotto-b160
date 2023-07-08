import * as yup from 'yup';

export const contractValidationSchema = yup.object().shape({
  provider_name: yup.string().required(),
  contract_details: yup.string().required(),
  client_id: yup.string().nullable(),
});
