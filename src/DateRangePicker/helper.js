import moment from "moment";

export const reverseRange = (startDate, endDate) => {
  if (
    startDate &&
    endDate &&
    moment(startDate).startOf("day").isAfter(moment(endDate).startOf("day"))
  ) {
    return { startDate: endDate, endDate: startDate, reversed: true };
  } else {
    return { startDate, endDate };
  }
};
