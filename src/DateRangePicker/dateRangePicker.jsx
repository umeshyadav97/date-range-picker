import React, { useState, useRef, Fragment, useEffect } from "react";
import {
  Box,
  Button,
  ClickAwayListener,
  Divider,
  Fade,
  IconButton,
  InputAdornment,
  Popper,
  Stack,
  TextField,
} from "@mui/material";
import classnames from "classnames";
import styled from "@emotion/styled";
import moment from "moment";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import ClearIcon from "@mui/icons-material/Clear";
import PropTypes from "prop-types";
import RangeSelector from "./rangeSelector/rangeSelector";
import { reverseRange } from "./helper";
import "./style.scss";

const RangeTextField = styled(TextField)({
  ".MuiInputBase-input": {
    minWidth: "200px",
  },
});

const PreDefinedRangeButton = styled(Button)({
  textTransform: "none",
  display: "flex",
  justifyContent: "flex-start",
  padding: "4px",
  "&.MuiButton-text": {
    color: "#000000",
  },
  "&.MuiButton-contained": {
    background: "#EDF4FB",
    color: "#1976D2",
    boxShadow: "none",
  },
});

const defaultRange = { startDate: null, endDate: null };

function DateRangePicker(props) {
  const {
    onRangeChange,
    onStartDateChange,
    onEndDateChange,
    value,
    noOfSelector,
    format,
    leftPanelRanges,
    minDate,
    maxDate,
    disabled,
    ...restProps
  } = props;

  const textFieldRef = useRef();
  const [activeMonth, setActiveMonth] = useState(moment());
  const [dateRange, setDateRange] = useState(defaultRange);
  const [hoveredEndDate, setHoveredEndDate] = useState(null);
  const [textFieldEl, setTextFieldEl] = useState();
  const [isHovered, setIsHovered] = useState(false);

  const { startDate, endDate } = dateRange;

  useEffect(() => {
    if (textFieldEl) {
      setActiveMonth(moment(startDate || new Date()));
    }

    if (!textFieldEl) {
      setDateRange({ ...defaultRange, ...value });
    }
  }, [!!textFieldEl]);

  useEffect(() => {
    setDateRange({ ...defaultRange, ...value });
  }, [value]);

  const handlePrevMonth = () => {
    setActiveMonth(moment(activeMonth).subtract(1, "month"));
  };

  const handleNextMonth = () => {
    setActiveMonth(moment(activeMonth).add(1, "month"));
  };

  const handleDateRangeSelection = (unix) => {
    const date = moment.unix(unix).startOf("day");

    if (startDate && endDate) {
      setDateRange({ startDate: date, endDate: null });
      onStartDateChange?.(date);
    } else if (startDate) {
      const ranges = reverseRange(startDate, date);
      setDateRange((prev) => ({ ...prev, ...ranges }));
      ranges.reversed && onStartDateChange?.(ranges.startDate);
      onEndDateChange?.(ranges.endDate);
    } else {
      setDateRange((prev) => ({ ...prev, startDate: date }));
      onStartDateChange?.(date);
    }
    setHoveredEndDate(null);
  };

  const handlePredefinedRangeSelection = (range) => {
    setDateRange(range);
    setActiveMonth(range.startDate);
  };

  const handleClearSelectedRange = (evt) => {
    evt?.stopPropagation?.();
    setDateRange(defaultRange);
    onRangeChange?.(defaultRange);
  };

  const handleEndDateHover = ({ target }) => {
    const { unix } = target.dataset;
    if (startDate && !endDate && unix) {
      setHoveredEndDate(moment.unix(unix));
    }
  };

  const openRangeSelector = (evt) => {
    if (disabled) return;
    evt?.stopPropagation?.();
    const el = textFieldRef.current;
    setTextFieldEl((prev) => (prev ? null : el));
  };

  const closeRangeSelector = () => {
    setTextFieldEl(null);
    setHoveredEndDate(null);
  };

  const onOk = () => {
    if (startDate && endDate) {
      onRangeChange?.(dateRange);
      closeRangeSelector();
    }
  };

  return (
    <Box sx={{ width: "fit-content" }}>
      <RangeTextField
        {...restProps}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        disabled={disabled}
        autoComplete="off"
        inputProps={{ ...restProps?.inputProps, readOnly: true }}
        focused={!!textFieldEl}
        ref={textFieldRef}
        onClick={openRangeSelector}
        value={`${
          startDate ? moment(startDate).format(format) : "Start Date"
        } - ${endDate ? moment(endDate).format(format) : "End Date"}`}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              {/* <RangeContainer sx={{ opacity: disabled ? 0.26 : 1 }}>
                <RangeField>
                  {startDate ? moment(startDate).format(format) : "Start Date"}
                </RangeField>
                <RemoveIcon />
                <RangeField>
                  {endDate ? moment(endDate).format(format) : "End Date"}
                </RangeField>
              </RangeContainer> */}
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                disabled={disabled}
                size="small"
                sx={{
                  visibility:
                    (startDate || endDate) && isHovered ? "visible" : "hidden",
                }}
                onClick={handleClearSelectedRange}
              >
                <ClearIcon fontSize="inherit" />
              </IconButton>
              <IconButton
                disabled={disabled}
                size="small"
                onClick={openRangeSelector}
              >
                <CalendarTodayIcon fontSize="inherit" />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      <Popper
        open={!!textFieldEl}
        anchorEl={textFieldEl}
        sx={{ zIndex: 14000 }}
        transition
      >
        {({ TransitionProps }) => (
          <Fade {...TransitionProps} timeout={200}>
            <Box>
              <ClickAwayListener onClickAway={closeRangeSelector}>
                <Stack
                  sx={{
                    p: 1,
                    width: "fit-content",
                    borderRadius: 2,
                    bgcolor: "background.paper",
                    boxShadow: 3,
                    border: "1px solid white",
                  }}
                  direction="row"
                >
                  <Box>
                    <Stack direction="row">
                      {Array.from({ length: noOfSelector }).map((_, i) => (
                        <Fragment key={i}>
                          <RangeSelector
                            {...{ minDate, maxDate, dateRange, hoveredEndDate }}
                            onPrevMonth={handlePrevMonth}
                            onNextMonth={handleNextMonth}
                            showMonth={moment(activeMonth).add(i, "month")}
                            onRangeSelection={handleDateRangeSelection}
                            onEndDateHover={handleEndDateHover}
                            hidePrev={i !== 0}
                            hideNext={i + 1 !== noOfSelector}
                          />
                          {((noOfSelector !== 1 && i + 1 !== noOfSelector) ||
                            !!leftPanelRanges.length) && (
                            <Divider orientation="vertical" flexItem />
                          )}
                        </Fragment>
                      ))}
                    </Stack>
                    <Stack
                      direction="row"
                      justifyContent="flex-end"
                      gap="12px"
                      sx={{ p: 1 }}
                    >
                      <Button size="small" onClick={closeRangeSelector}>
                        cancel
                      </Button>
                      <Button
                        size="small"
                        variant="contained"
                        disabled={!(startDate & endDate)}
                        onClick={onOk}
                      >
                        ok
                      </Button>
                    </Stack>
                  </Box>
                  {!!leftPanelRanges.length && (
                    <Stack sx={{ minWidth: "150px", pl: 1 }} gap="4px">
                      {leftPanelRanges.map((definedRange, index) => (
                        <PreDefinedRangeButton
                          key={index}
                          variant={classnames({
                            contained: definedRange.isSelected(dateRange),
                            text: !definedRange.isSelected(dateRange),
                          })}
                          size="small"
                          onClick={() =>
                            handlePredefinedRangeSelection(definedRange.range())
                          }
                        >
                          {definedRange.label}
                        </PreDefinedRangeButton>
                      ))}
                    </Stack>
                  )}
                </Stack>
              </ClickAwayListener>
            </Box>
          </Fade>
        )}
      </Popper>
    </Box>
  );
}

DateRangePicker.propTypes = {
  onRangeChange: PropTypes.func.isRequired,
  onStartDateChange: PropTypes.func,
  onEndDateChange: PropTypes.func,
  format: PropTypes.string,
  disabled: PropTypes.bool,
  leftPanelRanges: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      range: PropTypes.func,
      isSelected: PropTypes.func,
    })
  ),
  noOfSelector: (props, propName) =>
    (props[propName] < 1 || 3 < props[propName]) &&
    new Error("noOfSelector should be in between 1 and 3."),
  minDate: (props, propName) =>
    moment(props[propName]).isValid() &&
    new Error("min date is not a valid date."),
  maxDate: (props, propName) =>
    moment(props[propName]).isValid() &&
    new Error("max date is not a valid date."),
  value: (props, propName) => {
    if (!moment(props[propName].startDate).isValid())
      new Error("start date is not a valid date.");
    if (!moment(props[propName].endDate).isValid())
      new Error("end date is not a valid date.");
  },
};

DateRangePicker.defaultProps = {
  noOfSelector: 2,
  format: "DD/MM/YYYY",
  value: defaultRange,
  leftPanelRanges: [],
  size: "small",
  label: "Date Range",
  minDate: null,
  maxDate: null,
  disabled: false,
};

export default DateRangePicker;
