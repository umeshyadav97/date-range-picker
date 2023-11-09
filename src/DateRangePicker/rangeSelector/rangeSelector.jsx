import React from "react";
import classnames from "classnames";
import { Box, IconButton, Stack, Typography } from "@mui/material";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import moment from "moment";
import DateCell from "./dateCell";
import "./style.scss";

let weekDays = ["S", "M", "T", "W", "T", "F", "S"];

function RangeSelector({
  showMonth,
  onPrevMonth,
  onNextMonth,
  dateRange,
  hoveredEndDate,
  onRangeSelection,
  onEndDateHover,
  hidePrev,
  hideNext,
  minDate,
  maxDate,
}) {
  const startDateOfMonth = moment(showMonth).startOf("month");
  const endDateOfMonth = moment(showMonth).endOf("month");
  const totalDaysOfMonth = endDateOfMonth.diff(startDateOfMonth, "days") + 1;

  const prefixDays = startDateOfMonth.day();
  const suffixDays = 6 - endDateOfMonth.day();

  return (
    <Box className="range-selector">
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <IconButton
          size="medium"
          onClick={onPrevMonth}
          className={classnames({ "hide-btn": hidePrev })}
        >
          <KeyboardArrowLeftIcon fontSize="inherit" />
        </IconButton>
        <Typography component="span" fontSize="13px">
          {moment(showMonth).format("MMMM YYYY")}
        </Typography>
        <IconButton
          size="medium"
          onClick={onNextMonth}
          className={classnames({ "hide-btn": hideNext })}
        >
          <KeyboardArrowRightIcon fontSize="inherit" />
        </IconButton>
      </Stack>

      <Box className="day-header">
        {weekDays.map((day, i) => (
          <Typography key={day + i} className="day-cell" component="span">
            {day}
          </Typography>
        ))}
      </Box>

      <Box className="month-dates" onMouseOver={onEndDateHover}>
        {Array.from({ length: prefixDays }).map((_, ind) => (
          <Box key={ind} className="outside-date-cell" />
        ))}

        {Array.from({ length: totalDaysOfMonth }).map((_, i) => {
          const eachDateUnix = moment(showMonth)
            .date(i + 1)
            .startOf("day")
            .unix();

          const minDateUnix = moment(minDate).startOf("day").unix();
          const maxDateUnix = moment(maxDate).startOf("day").unix();

          const isDisabledForMinDate = !!minDate && eachDateUnix < minDateUnix;
          const isDisabledForMaxDate = !!maxDate && eachDateUnix > maxDateUnix;

          return (
            <DateCell
              key={eachDateUnix}
              disabled={isDisabledForMinDate || isDisabledForMaxDate}
              {...{ eachDateUnix, dateRange, hoveredEndDate, onRangeSelection }}
            />
          );
        })}

        {Array.from({ length: suffixDays }).map((_, ind) => (
          <Box key={ind} className="outside-date-cell" />
        ))}
      </Box>
    </Box>
  );
}

export default RangeSelector;
