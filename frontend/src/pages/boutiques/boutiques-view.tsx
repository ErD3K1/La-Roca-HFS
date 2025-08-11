import React, { ReactElement, useEffect } from 'react';
import Head from 'next/head'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import dayjs from "dayjs";
import {useAppDispatch, useAppSelector} from "../../stores/hooks";
import {useRouter} from "next/router";
import { fetch } from '../../stores/boutiques/boutiquesSlice'
import dataFormatter from '../../helpers/dataFormatter';
import LayoutAuthenticated from "../../layouts/Authenticated";
import {getPageTitle} from "../../config";
import SectionTitleLineWithButton from "../../components/SectionTitleLineWithButton";
import SectionMain from "../../components/SectionMain";
import CardBox from "../../components/CardBox";
import BaseButton from "../../components/BaseButton";
import BaseDivider from "../../components/BaseDivider";
import {mdiChartTimelineVariant} from "@mdi/js";
import {SwitchField} from "../../components/SwitchField";
import FormField from "../../components/FormField";

const BoutiquesView = () => {
    const router = useRouter()
    const dispatch = useAppDispatch()
    const { boutiques } = useAppSelector((state) => state.boutiques)

    const { id } = router.query;

    function removeLastCharacter(str) {
      console.log(str,`str`)
      return str.slice(0, -1);
    }

    useEffect(() => {
        dispatch(fetch({ id }));
    }, [dispatch, id]);

    return (
      <>
          <Head>
              <title>{getPageTitle('View boutiques')}</title>
          </Head>
          <SectionMain>
            <SectionTitleLineWithButton icon={mdiChartTimelineVariant} title={removeLastCharacter('View boutiques')} main>
                <BaseButton
                  color='info'
                  label='Edit'
                  href={`/boutiques/boutiques-edit/?id=${id}`}
                />
            </SectionTitleLineWithButton>
            <CardBox>

                <div className={'mb-4'}>
                    <p className={'block font-bold mb-2'}>Name</p>
                    <p>{boutiques?.name}</p>
                </div>

                <div className={'mb-4'}>
                    <p className={'block font-bold mb-2'}>Location</p>
                    <p>{boutiques?.location}</p>
                </div>

                <>
                    <p className={'block font-bold mb-2'}>Bags Boutique</p>
                    <CardBox
                      className='mb-6 border border-gray-300 rounded overflow-hidden'
                      hasTable
                    >
                        <div className='overflow-x-auto'>
                            <table>
                            <thead>
                            <tr>

                                <th>Code</th>

                                <th>Price</th>

                                <th>Status</th>

                            </tr>
                            </thead>
                            <tbody>
                            {boutiques.bags_boutique && Array.isArray(boutiques.bags_boutique) &&
                              boutiques.bags_boutique.map((item: any) => (
                                <tr key={item.id} onClick={() => router.push(`/bags/bags-view/?id=${item.id}`)}>

                                    <td data-label="code">
                                        { item.code }
                                    </td>

                                    <td data-label="price">
                                        { item.price }
                                    </td>

                                    <td data-label="status">
                                        { item.status }
                                    </td>

                                </tr>
                              ))}
                            </tbody>
                        </table>
                        </div>
                        {!boutiques?.bags_boutique?.length && <div className={'text-center py-4'}>No data</div>}
                    </CardBox>
                </>

                <BaseDivider />

                <BaseButton
                    color='info'
                    label='Back'
                    onClick={() => router.push('/boutiques/boutiques-list')}
                />
              </CardBox>
          </SectionMain>
      </>
    );
};

BoutiquesView.getLayout = function getLayout(page: ReactElement) {
    return (
      <LayoutAuthenticated>
          {page}
      </LayoutAuthenticated>
    )
}

export default BoutiquesView;
