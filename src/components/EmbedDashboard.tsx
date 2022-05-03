import React, { useCallback } from 'react';
import styled from "styled-components";
import { LookerEmbedSDK } from '@looker/embed-sdk';

const EmbedDashboard = (props: any) => {

  const DashboardDiv = useCallback((el:any ) => {
    LookerEmbedSDK.init('https://acuity.cloud.looker.com')
    LookerEmbedSDK.createDashboardWithId(props.id)
    .withTheme('Acuity')
    .appendTo(el)
    .withNext()
    .withFilters({'Install ID': props.filters})
    .build()
    .connect()
    .catch((error: any) => {
      console.error('An unexpected error occurred', error)
    })
  }, [])
  // [props.id,props.filters]

  return (
    <>
    <Dashboard ref={DashboardDiv}></Dashboard>
    </>
  );
}


const Dashboard = styled.div`
  width: 100%;
  height: 100%;
  & > iframe {
    width: 100%;
    height: 100%;
  }
` 

export default EmbedDashboard;
