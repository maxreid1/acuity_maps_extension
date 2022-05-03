/*
 * The MIT License (MIT)
 *
 * Copyright (c) 2019 Looker Data Sciences, Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

import React, { useState } from 'react'
import { ExtensionProvider } from '@looker/extension-sdk-react'
import { hot } from 'react-hot-loader/root'
import EmbedDashboard from './components/EmbedDashboard'
import SideBar from './components/SideBar'
import { ComponentsProvider, Box } from '@looker/components'
import MapViz from './components/MapViz'
// import MapViz from './components/MapViz'
// import GetLocationData from './components/Home/GetLocation'


export const App: React.FC<{}> = hot(() => {
  const id = 1;
  const filters = '-NULL';
  const [selectedInstalls, setSelectedInstalls] = React.useState(["loading"]);

  return (
    <ExtensionProvider>
      <ComponentsProvider>
        <Box margin={20}>
          <Box display={"flex"} height={"60%"} width={"100%"}>
            <Box width={"40%"} margin={20}>
              <SideBar selectedInstalls={selectedInstalls} setSelectedInstalls={setSelectedInstalls}/>
            </Box>
            <EmbedDashboard filters={['']} id={id} />
          </Box>
          <Box>
            <MapViz selectedInstalls={selectedInstalls}></MapViz>
          </Box>
        </Box>
      </ComponentsProvider>
    </ExtensionProvider>
  )
})


