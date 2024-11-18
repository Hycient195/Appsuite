import { useState } from "react"
import { comprehensiveInvoice } from "./globalDummyData"
import Commercial1 from "./commercial/Commercial1";

export default function useInvoiceTemplates() {
  const [ stateObject, setStateObject ] = useState(comprehensiveInvoice);

  const invoiceTemplates = {
    COMMERCIAL: [
      {
        templateName: "COMMERCIAL_1",
        templateMarkup: <Commercial1 setStateObject={setStateObject} stateObject={stateObject} />
      },
      {
        templateName: "COMMERCIAL_2",
        templateMarkup: <Commercial1 setStateObject={setStateObject} stateObject={stateObject} />
      },
      {
        templateName: "COMMERCIAL_3",
        templateMarkup: <Commercial1 setStateObject={setStateObject} stateObject={stateObject} />
      },
      {
        templateName: "COMMERCIAL_4",
        templateMarkup: <Commercial1 setStateObject={setStateObject} stateObject={stateObject} />
      },
    ],
    SIMPLE: [
      {
        templateName: "COMMERCIAL_1",
        templateMarkup: <Commercial1 setStateObject={setStateObject} stateObject={stateObject} />
      },
      {
        templateName: "COMMERCIAL_2",
        templateMarkup: <Commercial1 setStateObject={setStateObject} stateObject={stateObject} />
      }
    ],
    "PRO FORMA": [
      {
        templateName: "COMMERCIAL_1",
        templateMarkup: <Commercial1 setStateObject={setStateObject} stateObject={stateObject} />
      },
      {
        templateName: "COMMERCIAL_2",
        templateMarkup: <Commercial1 setStateObject={setStateObject} stateObject={stateObject} />
      }
    ]
  }

  return invoiceTemplates
}