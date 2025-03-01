import breakpoints from "../constants/breakpoints";
import makeResponsiveComponent from "./responsive";

const rules = [
    {
      constraint: "min",
      width: breakpoints.start,
      rules: `
        max-width: 100%;
        margin: 0 auto;
      `,
    },
    {
      constraint: { min: breakpoints.lg, max: breakpoints.xl },
      rules: `
        max-width: 100%;
      `,
    },
    {
      constraint: "min",
      width: breakpoints.xl + 1,
      rules: `
        max-width: 1600px;
      `,
    },
];

export const Container = makeResponsiveComponent(rules);