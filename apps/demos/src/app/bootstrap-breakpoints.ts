import { BREAKPOINT } from '@angular/flex-layout';

// match flex-layout breakpoints with bootstrap
// https://github.com/angular/flex-layout/wiki/Responsive-API
// https://getbootstrap.com/docs/5.0/layout/breakpoints/#available-breakpoints

const SM = 576;
const MD = 768;
const LG = 992;
const XL = 1200;

const PRINT_BREAKPOINTS = [
  {
    alias: 'xs',
    suffix: 'Xs',
    mediaQuery: `screen and (min-width: 0px) and (max-width: ${SM-1}px)`,
    overlapping: false,
    priority: 1001,
  },
  {
    alias: 'sm',
    suffix: 'Sm',
    mediaQuery: `screen and (min-width: ${SM}px) and (max-width: ${MD-1}px)`,
    overlapping: false,
    priority: 901,
  },
  {
    alias: 'md',
    suffix: 'Md',
    mediaQuery: `screen and (min-width: ${MD}px) and (max-width: ${LG-1}px)`,
    overlapping: false,
    priority: 801,
  },
  {
    alias: 'lg',
    suffix: 'Lg',
    mediaQuery: `screen and (min-width: ${LG}px) and (max-width: ${XL-1}px)`,
    overlapping: false,
    priority: 701,
  },
  {
    alias: 'xl',
    suffix: 'Xl',
    mediaQuery: `screen and (min-width: ${XL-1}px)`,
    overlapping: false,
    priority: 601,
  },
  // lower-than
  {
    alias: 'lt-sm',
    suffix: 'LtSm',
    mediaQuery: `screen and (max-width: ${SM-1}px)`,
    overlapping: true,
    priority: 951,
  },
  {
    alias: 'lt-md',
    suffix: 'LtMd',
    mediaQuery: `screen and (max-width: ${MD-1}px)`,
    overlapping: true,
    priority: 851,
  },
  {
    alias: 'lt-lg',
    suffix: 'LtLg',
    mediaQuery: `screen and (max-width: ${LG-1}px)`,
    overlapping: true,
    priority: 751,
  },
  {
    alias: 'lt-xl',
    suffix: 'LtXl',
    mediaQuery: `screen and (max-width: ${XL-1}px)`,
    overlapping: true,
    priority: 651,
  },
  // greater-than
  {
    alias: 'gt-sm',
    suffix: 'GtSm',
    mediaQuery: `screen and (min-width: ${SM}px)`,
    overlapping: true,
    priority: -949,
  },
  {
    alias: 'gt-md',
    suffix: 'GtMd',
    mediaQuery: `screen and (min-width: ${MD}px)`,
    overlapping: true,
    priority: -849,
  },
  {
    alias: 'gt-lg',
    suffix: 'GtLg',
    mediaQuery: `screen and (min-width: ${LG}px)`,
    overlapping: true,
    priority: -749,
  },
  {
    alias: 'gt-xl',
    suffix: 'GtXl',
    mediaQuery: `screen and (min-width: ${XL}px)`,
    overlapping: true,
    priority: -649,
  },
];

export const CustomBreakPointsProvider = {
  provide: BREAKPOINT,
  useValue: PRINT_BREAKPOINTS,
  multi: true
};
