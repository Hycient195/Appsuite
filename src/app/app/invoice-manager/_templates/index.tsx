import Commercial1 from "./commercial/Commercial1";
import Simple1 from "./simple/Simple1";

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

