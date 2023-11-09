import React, { useState } from "react";
import moment from "moment";
import DateRangePicker from "./DateRangePicker";
import "./App.css";
import { Box, Stack, Typography } from "@mui/material";

const rangeSelectorLeftPanelItemActive = (range, definedRange) => {
  return (
    moment(range.startDate)
      .startOf("day")
      .isSame(moment(definedRange.startDate).startOf("day")) &&
    moment(range.endDate)
      .endOf("day")
      .isSame(moment(definedRange.endDate).endOf("day"))
  );
};

const getPredefinedDateRanges = () => {
  return [
    {
      label: "Today",
      range: () => ({
        startDate: moment(),
        endDate: moment(),
      }),
      isSelected(range) {
        return rangeSelectorLeftPanelItemActive(range, this.range());
      },
    },
    {
      label: "Week till date",
      range: () => ({
        startDate: moment().startOf("week").add(1, "days"),
        endDate: moment(),
      }),
      isSelected(range) {
        const definedRange = this.range();
        return rangeSelectorLeftPanelItemActive(range, definedRange);
      },
    },
    {
      label: "Month till date",
      range: () => ({
        startDate: moment().startOf("month"),
        endDate: moment(),
      }),
      isSelected(range) {
        const definedRange = this.range();
        return rangeSelectorLeftPanelItemActive(range, definedRange);
      },
    },
    {
      label: "Last 30 Days",
      range: () => ({
        startDate: moment().subtract(29, "days"),
        endDate: moment(),
      }),
      isSelected(range) {
        const definedRange = this.range();
        return rangeSelectorLeftPanelItemActive(range, definedRange);
      },
    },
    {
      label: "Last 7 Days",
      range: () => ({
        startDate: moment().subtract(6, "days"),
        endDate: moment(),
      }),
      isSelected(range) {
        const definedRange = this.range();
        return rangeSelectorLeftPanelItemActive(range, definedRange);
      },
    },
  ];
};

function App() {
  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: "24px",
        }}
      >
        <Demo
          text="Single Selector Date Range Picker"
          noOfSelector={1}
          format="DD-MMM-YYYY"
        />
        <Demo text="Double Selector Date Range Picker" noOfSelector={2} />
        <Demo
          text="Pre defined ranges"
          noOfSelector={2}
          leftPanelRanges={getPredefinedDateRanges()}
        />
        <Demo
          disabled
          text="Disabled"
          noOfSelector={1}
          leftPanelRanges={getPredefinedDateRanges()}
        />
        <Demo
          text="min date and max date"
          noOfSelector={1}
          minDate={moment().startOf("month").add(1, "days")}
          maxDate={moment()}
          leftPanelRanges={getPredefinedDateRanges()}
        />
        <Demo
          text="keep selector open"
          noOfSelector={1}
          minDate={moment().startOf("month").add(1, "days")}
          maxDate={moment()}
          leftPanelRanges={getPredefinedDateRanges()}
          keepSelectorOpen={true}
        />
      </Box>
    </>
  );
}

const Demo = ({ text, ...rest }) => {
  const [dateRange, setDateRange] = useState({
    startDate: null,
    endDate: null,
  });

  return (
    <Stack>
      <Typography fontSize="12px" fontWeight={500} sx={{ mb: 1 }}>
        {text}
      </Typography>
      <DateRangePicker
        {...rest}
        sx={{width:"350px"}}
        fullWidth
        onRangeChange={setDateRange}
        value={dateRange}
      />
    </Stack>
  );
};

export default App;
