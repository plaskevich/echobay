import { PiChatCenteredTextDuotone, PiShoppingCartDuotone } from 'react-icons/pi';
import { useNavigate } from 'react-router-dom';

import { Button } from '@/components/common/Button';

interface BuyerActionsProps {
  listingId: string;
}

export function BuyerActions({ listingId }: BuyerActionsProps) {
  const navigate = useNavigate();

  const handleBuyNow = () => {
    navigate(`/checkout/${listingId}`);
  };

  return (
    <>
      <Button variant="primary" size="medium" fullWidth onClick={handleBuyNow}>
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
