import { LookerEmbedSDK } from '@looker/embed-sdk';
import {
  ExtensionContext,
  ExtensionContextData,
  getCore40SDK
 } from '@looker/extension-sdk-react';
import React, { useContext, useEffect } from 'react';
import { 
    CheckboxGroup, Button
   } from '@looker/components'


export default function Sidebar (props: any) {
    const extensionContext = useContext<ExtensionContextData>(ExtensionContext)
    const sdk = extensionContext.core40SDK
    // this stores the options for the checkbox selection
    const [installID, setInstallID] = React.useState([{"label":"Loading","value":"loading"}]);
    // this stores the options for the checkbox selection: props.selectedInstalls and props.setSelectedInstalls

    // this gets list of install IDs to pass into query for filter suggestions
    const availableInstallIDs = () => {
        sdk.run_inline_query({
            result_format: 'json',
            body: {
              model: 'acuity',
              view: 'search_partitioned',
              fields: ['search_partitioned.installid','search_partitioned.count' ],
              sorts: ['search_partitioned.count desc'],
              limit: "15",
              filters: {"positionchanged_partitioned.lat":">0"}
            }
          }).then((result:any ) => {
            if(result.ok){
                const filterables = result.value.map((r:any) => ({
                    // Value is how the variable is stored
                    value: r["search_partitioned.installid"],
                    // Label is what the end user sees
                    label: r["search_partitioned.installid"] + " (" + String(r["search_partitioned.count"]) + ")"
                }));
                const defaultAll = filterables.map((r:any) => (r.value));
                console.log('available installs query, default: ', defaultAll)
                console.log('available installs query, options: ', filterables)
                setInstallID(filterables);
                props.setSelectedInstalls(defaultAll);
            }
          })
      }
    
    // on load get all install IDs
    useEffect(() => {
        availableInstallIDs();
    },[])

    function handleClick(e:any) {
        e.preventDefault();
        props.setSelectedInstalls(['']);
    }
    
    return (
        <>
            <Button onClick={handleClick}>
                Unselect All
            </Button>
            <CheckboxGroup
                name="group1"
                onChange={props.setSelectedInstalls}
                options={installID}
                value={props.selectedInstalls}
            />
        </>
    )
}