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

  const handleContactSeller = () => {
    navigate(`/messages?listingId=${listingId}`);
  };

  return (
    <>
      <Button variant="primary" size="medium" fullWidth onClick={handleBuyNow} data-testid="buy-now-button">
        <i className="hn hn-shopping-cart" />
        Purchase
      </Button>
      <Button
        variant="outline"
        size="medium"
        fullWidth
        onClick={handleContactSeller}
        data-testid="contact-seller-button"
      >
        <i className="hn hn-message-dots" />
        Message seller
      </Button>
    </>
  );
}
