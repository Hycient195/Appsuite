// import React, { useState } from "react"
// import { comprehensiveInvoice } from "./globalDummyData"
import Commercial1 from "./commercial/Commercial1";
import Simple1 from "./simple/Simple1";

// export default function useInvoiceTemplates() {
//   const [ stateObject, setStateObject ] = useState(comprehensiveInvoice);

//   const invoiceTemplates = {
//     COMMERCIAL: [
//       {
//         templateId: "COMMERCIAL_1",
//         templateMarkup: <Commercial1 templateId="COMMERCIAL_1" setStateObject={setStateObject} stateObject={stateObject} />
//       },
//       {
//         templateId: "COMMERCIAL_2",
//         templateMarkup: React.cloneElement(<Commercial1 templateId="COMMERCIAL_2" setStateObject={setStateObject} stateObject={stateObject} />)
//       },
//       {
//         templateId: "COMMERCIAL_3",
//         templateMarkup: <Commercial1 templateId="COMMERCIAL_3" setStateObject={setStateObject} stateObject={stateObject} />
//       },
//       {
//         templateId: "COMMERCIAL_4",
//         templateMarkup: <Commercial1 templateId="COMMERCIAL_4" setStateObject={setStateObject} stateObject={stateObject} />
//       },
//     ],
//     SIMPLE: [
//       {
//         templateId: "COMMERCIAL_5",
//         templateMarkup: <Commercial1 templateId="COMMERCIAL_5" setStateObject={setStateObject} stateObject={stateObject} />
//       },
//       {
//         templateId: "COMMERCIAL_6",
//         templateMarkup: <Commercial1 templateId="COMMERCIAL_6" setStateObject={setStateObject} stateObject={stateObject} />
//       }
//     ],
//     "PRO FORMA": [
//       {
//         templateId: "COMMERCIAL_7",
//         templateMarkup: <Commercial1 templateId="COMMERCIAL_7" setStateObject={setStateObject} stateObject={stateObject} />
//       },
//       {
//         templateId: "COMMERCIAL_8",
//         templateMarkup: <Commercial1 templateId="COMMERCIAL_8" setStateObject={setStateObject} stateObject={stateObject} />
//       }
//     ]
//   }

//   return invoiceTemplates
// }

export const invoiceTemplates = {
  COMMERCIAL: {
    COMMERCIAL_1: {
      templateMarkup: Commercial1
    },
    COMMERCIAL_2: {
      templateMarkup: Commercial1
    },
    COMMERCIAL_3: {
      templateMarkup: Commercial1
    },
    COMMERCIAL_4: {
      templateMarkup: Commercial1
    },
    COMMERCIAL_5: {
      templateMarkup: Commercial1
    },
    COMMERCIAL_6: {
      templateMarkup: Commercial1
    },
  },
  SIMPLE: {
    SIMPLE_1: {
      templateMarkup: Simple1
    },
    SIMPLE_2: {
      templateMarkup: Commercial1
    }
  },
  "PRO FORMA": {
    "PRO_FORMA_1": {
      templateMarkup: Commercial1
    },
    "PRO_FORMA_2": {
      templateMarkup: Commercial1
    }
  }
}

