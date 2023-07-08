import AppLayout from 'layout/app-layout';
import React, { useState } from 'react';
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  Box,
  Spinner,
  FormErrorMessage,
  Switch,
  NumberInputStepper,
  NumberDecrementStepper,
  NumberInputField,
  NumberIncrementStepper,
  NumberInput,
} from '@chakra-ui/react';
import { useFormik, FormikHelpers } from 'formik';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { FiEdit3 } from 'react-icons/fi';
import { useRouter } from 'next/router';
import { createRefundClaim } from 'apiSdk/refund-claims';
import { Error } from 'components/error';
import { refundClaimValidationSchema } from 'validationSchema/refund-claims';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, requireNextAuth, withAuthorization } from '@roq/nextjs';
import { compose } from 'lib/compose';
import { ClientInterface } from 'interfaces/client';
import { getClients } from 'apiSdk/clients';
import { RefundClaimInterface } from 'interfaces/refund-claim';

function RefundClaimCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (values: RefundClaimInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await createRefundClaim(values);
      resetForm();
      router.push('/refund-claims');
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<RefundClaimInterface>({
    initialValues: {
      claim_status: '',
      client_id: (router.query.client_id as string) ?? null,
    },
    validationSchema: refundClaimValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
    validateOnChange: false,
    validateOnBlur: false,
  });

  return (
    <AppLayout>
      <Box bg="white" p={4} rounded="md" shadow="md">
        <Box mb={4}>
          <Text as="h1" fontSize="2xl" fontWeight="bold">
            Create Refund Claim
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        <form onSubmit={formik.handleSubmit}>
          <FormControl id="claim_status" mb="4" isInvalid={!!formik.errors?.claim_status}>
            <FormLabel>Claim Status</FormLabel>
            <Input type="text" name="claim_status" value={formik.values?.claim_status} onChange={formik.handleChange} />
            {formik.errors.claim_status && <FormErrorMessage>{formik.errors?.claim_status}</FormErrorMessage>}
          </FormControl>
          <AsyncSelect<ClientInterface>
            formik={formik}
            name={'client_id'}
            label={'Select Client'}
            placeholder={'Select Client'}
            fetcher={getClients}
            renderOption={(record) => (
              <option key={record.id} value={record.id}>
                {record?.name}
              </option>
            )}
          />
          <Button isDisabled={formik?.isSubmitting} colorScheme="blue" type="submit" mr="4">
            Submit
          </Button>
        </form>
      </Box>
    </AppLayout>
  );
}

export default compose(
  requireNextAuth({
    redirectTo: '/',
  }),
  withAuthorization({
    service: AccessServiceEnum.PROJECT,
    entity: 'refund_claim',
    operation: AccessOperationEnum.CREATE,
  }),
)(RefundClaimCreatePage);
