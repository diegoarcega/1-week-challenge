import dayjs from 'dayjs';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import isBetween from 'dayjs/plugin/isBetween';

dayjs.extend(advancedFormat);
dayjs.extend(isBetween);

export default dayjs;
