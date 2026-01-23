import { PiChatCenteredTextDuotone, PiShoppingCartDuotone } from 'react-icons/pi';

import { Button } from '@/components/common/Button';

export function BuyerActions() {
  return (
    <>
      <Button variant="primary" size="medium" fullWidth>
        <PiShoppingCartDuotone size={20} />
        Buy now
      </Button>
      <Button variant="outline" size="medium" fullWidth>
        <PiChatCenteredTextDuotone size={20} />
        Contact seller
      </Button>
    </>
  );
}
