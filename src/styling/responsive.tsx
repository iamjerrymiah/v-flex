import styled from 'styled-components';
import { DEFAULT_SIZE_UNIT } from '../constants/constants';

//Creates a styled component based on the rules and tag
const makeResponsiveComponent = (ruleSets:any, tagName = 'div') => {
  return styled(tagName)`
    ${buildStyles(ruleSets)}
  `;
};

//Creates a string of styles based on the breakpoints and rules set
const buildStyles = (rules = []) => {
  const styles = rules.reduce(
    (finalCssString, { constraint, width, rules }:any) => {
      if (typeof constraint === 'string') {
        return `${finalCssString} @media (${constraint}-width: ${width}${DEFAULT_SIZE_UNIT}) { ${rules} }`;
      }

      if (constraint.min && constraint.max) {
        return `${finalCssString} @media (min-width: ${constraint.min}${DEFAULT_SIZE_UNIT}) and (max-width: ${constraint.max}${DEFAULT_SIZE_UNIT}) { ${rules} }`;
      }

      return '';
    },
    ''
  );

  return styles;
};

//A function to hide a component at specified breakpoints
export const hideAt = (breakpoints:any) => {
  const ruleSets = Object.entries(breakpoints).reduce(
    (rules:any, [constraint, width]) => [
      ...rules,
      { constraint, width, rules: `display: none` },
    ],
    []
  );

  return makeResponsiveComponent(ruleSets);
};

//A utility component for hiding items based on specified breakpoints
export const Breakpoint = ({ min, max, children }:any) => {
  const Component = hideAt({ min, max });
  return <Component>{children}</Component>;
};

/**
 *  Params
 *
 * @Rule
 * {
 *    constraint: 'min',
 *    width: '0',
 *    rules: `
 *      property: value;
 *    `
 * }
 *
 * @breakpoint
 * {
 *    min: "320px"
 * }
 */

export default makeResponsiveComponent;
