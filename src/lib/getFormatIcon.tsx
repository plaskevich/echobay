import { PiCassetteTapeDuotone, PiDiscDuotone, PiVinylRecordDuotone } from 'react-icons/pi';

export function getFormatIcon(value?: string | null, size = 14) {
  switch (value) {
    case 'vinyl':
      return <PiVinylRecordDuotone size={size} />;
    case 'cd':
      return <PiDiscDuotone size={size} />;
    case 'tape':
      return <PiCassetteTapeDuotone size={size} />;
    default:
      return <PiVinylRecordDuotone size={size} />;
  }
}
