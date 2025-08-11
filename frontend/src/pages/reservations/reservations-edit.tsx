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

import { update, fetch } from '../../stores/reservations/reservationsSlice'
import { useAppDispatch, useAppSelector } from '../../stores/hooks'
import { useRouter } from 'next/router'
import dataFormatter from '../../helpers/dataFormatter';

const EditReservationsPage = () => {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const initVals = {

    guest: null,

    reservation_date: new Date(),

    pickup_location: '',

  }
  const [initialValues, setInitialValues] = useState(initVals)

  const { reservations } = useAppSelector((state) => state.reservations)

  const { id } = router.query

  useEffect(() => {
    dispatch(fetch({ id: id }))
  }, [id])

  useEffect(() => {
    if (typeof reservations === 'object') {
      setInitialValues(reservations)
    }
  }, [reservations])

  useEffect(() => {
      if (typeof reservations === 'object') {
          const newInitialVal = {...initVals};
          Object.keys(initVals).forEach(el => newInitialVal[el] = (reservations)[el])
          setInitialValues(newInitialVal);
      }
  }, [reservations])

  const handleSubmit = async (data) => {
    await dispatch(update({ id: id, data }))
    await router.push('/reservations/reservations-list')
  }

  return (
    <>
      <Head>
        <title>{getPageTitle('Edit reservations')}</title>
      </Head>
      <SectionMain>
        <SectionTitleLineWithButton icon={mdiChartTimelineVariant} title={'Edit reservations'} main>
        {''}
        </SectionTitleLineWithButton>
        <CardBox>
          <Formik
            enableReinitialize
            initialValues={initialValues}
            onSubmit={(values) => handleSubmit(values)}
          >
            <Form>

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

      <FormField
          label="ReservationDate"
      >
          <DatePicker
              dateFormat="yyyy-MM-dd hh:mm"
              showTimeSelect
              selected={initialValues.reservation_date ?
                  new Date(
                      dayjs(initialValues.reservation_date).format('YYYY-MM-DD hh:mm'),
                  ) : null
              }
              onChange={(date) => setInitialValues({...initialValues, 'reservation_date': date})}
          />
      </FormField>

    <FormField label="PickupLocation" labelFor="pickup_location">
        <Field name="pickup_location" id="pickup_location" component="select">

            <option value="concierge">concierge</option>

            <option value="apartment">apartment</option>

            <option value="new_concierge">new_concierge</option>

        </Field>
    </FormField>

              <BaseDivider />
              <BaseButtons>
                <BaseButton type="submit" color="info" label="Submit" />
                <BaseButton type="reset" color="info" outline label="Reset" />
                <BaseButton type='reset' color='danger' outline label='Cancel' onClick={() => router.push('/reservations/reservations-list')}/>
              </BaseButtons>
            </Form>
          </Formik>
        </CardBox>
      </SectionMain>
    </>
  )
}

EditReservationsPage.getLayout = function getLayout(page: ReactElement) {
  return (
      <LayoutAuthenticated>
          {page}
      </LayoutAuthenticated>
  )
}

export default EditReservationsPage
