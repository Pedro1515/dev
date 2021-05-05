import { Run } from "src/api";
import { sum } from "./number";

export function getTotalBy(key: "feature" | "scenario" | "steps", run?: Run) {
  let filterKey;
  switch (key) {
    case "feature":
      filterKey = "parentLength";
      break;
    case "scenario":
      filterKey = "childLength";
      break;
    case "steps":
      filterKey = "grandChildLength";
      break;
    default:
      break;
  }

  if (run) {
    const quantities = Object.keys(run)
      .map((key) => {
        return key.toLowerCase() == filterKey.toLowerCase() ? run[key] : null;
      })
      .filter((quantity) => quantity);

    return sum(quantities);
  }

  return 0;
}
