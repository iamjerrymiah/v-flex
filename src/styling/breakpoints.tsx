import breakpoints from '../constants/breakpoints';
import { hideAt } from '../styling/responsive';

export const SmallAndDown = hideAt({ min: '320px' });
export const MediumAndDown = hideAt({ min: '960px' });
export const MediumOnly = hideAt({ max: '640px', min: '960px' });
export const MediumAndUp = hideAt({ max: '640px' });
export const LargeAndUp = hideAt({ max: '960px' });

export const DesktopOnly = hideAt({ max: breakpoints.lg});
export const DesktopAndTablet = hideAt({ max: breakpoints.sm });
export const MobileOnly = hideAt({ min: breakpoints.sm });
export const MobileAndTablet = hideAt({ min: breakpoints.lg });
