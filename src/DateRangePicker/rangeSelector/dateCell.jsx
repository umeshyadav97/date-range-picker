import React from "react";
import classnames from "classnames";
import { Box, IconButton } from "@mui/material";
import moment from "moment";
import { reverseRange } from "../helper";

const DateCell = (props) => {
  const {
    eachDateUnix,
    dateRange,
    hoveredEndDate,
    onRangeSelection,
    disabled,
  } = props;

  // will reverse the range if start date exceeded the end date (end date -> (selected end date && hovered end date))
  const { startDate, endDate, reversed } = reverseRange(
    dateRange.startDate,
    dateRange.endDate || hoveredEndDate
  );

  const startDateUnix = startDate
    ? moment(startDate).startOf("day").unix()
    : null;
  const endDateUnix = endDate ? moment(endDate).startOf("day").unix() : null;

  const todaysDateUnix = moment().startOf("day").unix();
  const startOfMonthUnix = moment.unix(eachDateUnix).startOf("month").unix();
  const endOfMonthUnix = moment
    .unix(eachDateUnix)
    .endOf("month")
    .startOf("day")
    .unix();
  const startOfWeekUnix = moment.unix(eachDateUnix).startOf("week").unix();
  const endOfWeekUnix = moment
    .unix(eachDateUnix)
    .endOf("week")
    .startOf("day")
    .unix();

  const isCoveredInRange =
    startDateUnix <= eachDateUnix && eachDateUnix <= endDateUnix;

  // will start the hovering or coloring in case of -> starting of week or month (falling in range)
  const isStartRange =
    isCoveredInRange &&
    startDateUnix !== endDateUnix &&
    (startDateUnix === eachDateUnix ||
      startOfWeekUnix === eachDateUnix ||
      startOfMonthUnix === eachDateUnix);

  const isEndRange =
    isCoveredInRange &&
    startDateUnix !== endDateUnix &&
    (endDateUnix === eachDateUnix ||
      endOfWeekUnix === eachDateUnix ||
      endOfMonthUnix === eachDateUnix);

  const isInRange =
    !(isStartRange || isEndRange) &&
    startDateUnix < eachDateUnix &&
    eachDateUnix < endDateUnix;

  // if it is the last date in the week and it has been selected or hovered
  // if it is the first date in the  week and it has been selected or hovered
  const isOnlyDateInWeek =
    isCoveredInRange &&
    (endOfWeekUnix === startOfMonthUnix ||
      endOfMonthUnix === startOfWeekUnix ||
      startDateUnix === endOfWeekUnix ||
      endDateUnix === startOfWeekUnix ||
      startDateUnix === endDateUnix ||
      endOfMonthUnix === startDateUnix);

  const isRangeSelected = dateRange.startDate && dateRange.endDate;

  const highLightSelected =
    (reversed
      ? endDateUnix === eachDateUnix
      : startDateUnix === eachDateUnix) || isRangeSelected
      ? startDateUnix === eachDateUnix || endDateUnix === eachDateUnix
      : false;

  return (
    <Box
      className={classnames("date-cell-box", {
        "start-range": isStartRange,
        "in-range": isInRange,
        "end-range": isEndRange,
        "only-date-in-week": isOnlyDateInWeek,
        "range-selected": isCoveredInRange && isRangeSelected,
      })}
    >
      <IconButton
        className={classnames("date-cell-btn", {
          "date-cell-selected-btn": highLightSelected,
          "todays-date-btn": todaysDateUnix === eachDateUnix,
        })}
        data-unix={eachDateUnix}
        onClick={() => onRangeSelection(eachDateUnix)}
        disabled={disabled}
      >
        {moment.unix(eachDateUnix).format("D")}
      </IconButton>
    </Box>
  );
};

export default DateCell;
