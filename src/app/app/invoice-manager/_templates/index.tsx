import Commercial1 from "./commercial/Commercial1";
import Commercial2 from "./commercial/Commercial2";
import Simple1 from "./simple/Simple1";
import Simple2 from "./simple/Simple2";
;

export const invoiceTemplates = {
  COMMERCIAL: {
    COMMERCIAL_1: {
      templateMarkup: Commercial1
    },
    COMMERCIAL_2: {
      templateMarkup: Commercial2
    },
  },
  SIMPLE: {
    SIMPLE_1: {
      templateMarkup: Simple1
    },
    SIMPLE_2: {
      templateMarkup: Simple2
    },
  },

}

