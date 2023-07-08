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
  Center,
} from '@chakra-ui/react';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { FiEdit3 } from 'react-icons/fi';
import { useFormik, FormikHelpers } from 'formik';
import { getRefundClaimById, updateRefundClaimById } from 'apiSdk/refund-claims';
import { Error } from 'components/error';
import { refundClaimValidationSchema } from 'validationSchema/refund-claims';
import { RefundClaimInterface } from 'interfaces/refund-claim';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, requireNextAuth, withAuthorization } from '@roq/nextjs';
import { compose } from 'lib/compose';
import { ClientInterface } from 'interfaces/client';
import { getClients } from 'apiSdk/clients';

function RefundClaimEditPage() {
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<RefundClaimInterface>(
    () => (id ? `/refund-claims/${id}` : null),
    () => getRefundClaimById(id),
  );
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (values: RefundClaimInterface, { resetForm }: FormikHelpers<any>) => {
    setFormError(null);
    try {
      const updated = await updateRefundClaimById(id, values);
      mutate(updated);
      resetForm();
      router.push('/refund-claims');
    } catch (error) {
      setFormError(error);
    }
  };

  const formik = useFormik<RefundClaimInterface>({
    initialValues: data,
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
            Edit Refund Claim
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        {formError && (
          <Box mb={4}>
            <Error error={formError} />
          </Box>
        )}
        {isLoading || (!formik.values && !error) ? (
          <Center>
            <Spinner />
          </Center>
        ) : (
          <form onSubmit={formik.handleSubmit}>
            <FormControl id="claim_status" mb="4" isInvalid={!!formik.errors?.claim_status}>
              <FormLabel>Claim Status</FormLabel>
              <Input
                type="text"
                name="claim_status"
                value={formik.values?.claim_status}
                onChange={formik.handleChange}
              />
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
        )}
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
    operation: AccessOperationEnum.UPDATE,
  }),
)(RefundClaimEditPage);
