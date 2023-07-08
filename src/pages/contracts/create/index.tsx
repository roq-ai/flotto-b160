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
import { createContract } from 'apiSdk/contracts';
import { Error } from 'components/error';
import { contractValidationSchema } from 'validationSchema/contracts';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, requireNextAuth, withAuthorization } from '@roq/nextjs';
import { compose } from 'lib/compose';
import { ClientInterface } from 'interfaces/client';
import { getClients } from 'apiSdk/clients';
import { ContractInterface } from 'interfaces/contract';

function ContractCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (values: ContractInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await createContract(values);
      resetForm();
      router.push('/contracts');
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<ContractInterface>({
    initialValues: {
      provider_name: '',
      contract_details: '',
      client_id: (router.query.client_id as string) ?? null,
    },
    validationSchema: contractValidationSchema,
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
            Create Contract
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        <form onSubmit={formik.handleSubmit}>
          <FormControl id="provider_name" mb="4" isInvalid={!!formik.errors?.provider_name}>
            <FormLabel>Provider Name</FormLabel>
            <Input
              type="text"
              name="provider_name"
              value={formik.values?.provider_name}
              onChange={formik.handleChange}
            />
            {formik.errors.provider_name && <FormErrorMessage>{formik.errors?.provider_name}</FormErrorMessage>}
          </FormControl>
          <FormControl id="contract_details" mb="4" isInvalid={!!formik.errors?.contract_details}>
            <FormLabel>Contract Details</FormLabel>
            <Input
              type="text"
              name="contract_details"
              value={formik.values?.contract_details}
              onChange={formik.handleChange}
            />
            {formik.errors.contract_details && <FormErrorMessage>{formik.errors?.contract_details}</FormErrorMessage>}
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
    entity: 'contract',
    operation: AccessOperationEnum.CREATE,
  }),
)(ContractCreatePage);
