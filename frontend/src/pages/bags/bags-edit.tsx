import { mdiChartTimelineVariant, mdiUpload } from '@mdi/js'
import Head from 'next/head'
import React, { ReactElement, useEffect, useState } from 'react'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import dayjs from "dayjs";

import CardBox from '../../components/CardBox'
import LayoutAuthenticated from '../../layouts/Authenticated'
import SectionMain from '../../components/SectionMain'
import SectionTitleLineWithButton from '../../components/SectionTitleLineWithButton'
import { getPageTitle } from '../../config'

import { Field, Form, Formik } from 'formik'
import FormField from '../../components/FormField'
import BaseDivider from '../../components/BaseDivider'
import BaseButtons from '../../components/BaseButtons'
import BaseButton from '../../components/BaseButton'
import FormCheckRadio from '../../components/FormCheckRadio'
import FormCheckRadioGroup from '../../components/FormCheckRadioGroup'
import { SelectField } from "../../components/SelectField";
import { SelectFieldMany } from "../../components/SelectFieldMany";
import { SwitchField } from '../../components/SwitchField'
import {RichTextField} from "../../components/RichTextField";

import { update, fetch } from '../../stores/bags/bagsSlice'
import { useAppDispatch, useAppSelector } from '../../stores/hooks'
import { useRouter } from 'next/router'
import dataFormatter from '../../helpers/dataFormatter';

const EditBagsPage = () => {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const initVals = {

    'code': '',

    'price': '',

    status: '',

    guest: null,

    boutique: null,

  }
  const [initialValues, setInitialValues] = useState(initVals)

  const { bags } = useAppSelector((state) => state.bags)

  const { id } = router.query

  useEffect(() => {
    dispatch(fetch({ id: id }))
  }, [id])

  useEffect(() => {
    if (typeof bags === 'object') {
      setInitialValues(bags)
    }
  }, [bags])

  useEffect(() => {
      if (typeof bags === 'object') {
          const newInitialVal = {...initVals};
          Object.keys(initVals).forEach(el => newInitialVal[el] = (bags)[el])
          setInitialValues(newInitialVal);
      }
  }, [bags])

  const handleSubmit = async (data) => {
    await dispatch(update({ id: id, data }))
    await router.push('/bags/bags-list')
  }

  return (
    <>
      <Head>
        <title>{getPageTitle('Edit bags')}</title>
      </Head>
      <SectionMain>
        <SectionTitleLineWithButton icon={mdiChartTimelineVariant} title={'Edit bags'} main>
        {''}
        </SectionTitleLineWithButton>
        <CardBox>
          <Formik
            enableReinitialize
            initialValues={initialValues}
            onSubmit={(values) => handleSubmit(values)}
          >
            <Form>

    <FormField
        label="Code"
    >
        <Field
            name="code"
            placeholder="Code"
        />
    </FormField>

    <FormField
        label="Price"
    >
        <Field
            type="number"
            name="price"
            placeholder="Price"
        />
    </FormField>

    <FormField label="Status" labelFor="status">
        <Field name="status" id="status" component="select">

            <option value="registered">registered</option>

            <option value="in_transit">in_transit</option>

            <option value="delivered">delivered</option>

        </Field>
    </FormField>

  <FormField label='Guest' labelFor='guest'>
        <Field
            name='guest'
            id='guest'
            component={SelectField}
            options={initialValues.guest}
            itemRef={'users'}

            showField={'firstName'}

        ></Field>
    </FormField>

  <FormField label='Boutique' labelFor='boutique'>
        <Field
            name='boutique'
            id='boutique'
            component={SelectField}
            options={initialValues.boutique}
            itemRef={'boutiques'}

            showField={'name'}

        ></Field>
    </FormField>

              <BaseDivider />
              <BaseButtons>
                <BaseButton type="submit" color="info" label="Submit" />
                <BaseButton type="reset" color="info" outline label="Reset" />
                <BaseButton type='reset' color='danger' outline label='Cancel' onClick={() => router.push('/bags/bags-list')}/>
              </BaseButtons>
            </Form>
          </Formik>
        </CardBox>
      </SectionMain>
    </>
  )
}

EditBagsPage.getLayout = function getLayout(page: ReactElement) {
  return (
      <LayoutAuthenticated>
          {page}
      </LayoutAuthenticated>
  )
}

export default EditBagsPage
