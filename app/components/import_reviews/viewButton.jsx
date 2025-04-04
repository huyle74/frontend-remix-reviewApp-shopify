import { useState } from "react";
import { Button } from "@shopify/polaris";
import { Link } from "@remix-run/react";
import { ViewIcon } from "@shopify/polaris-icons";

export default function ViewButton({ id, onClick, disabled }) {
  const [loading, setLoading] = useState(false);
  return (
    <Link onClick={() => setLoading(true)}>
      <Button
        url={`/app/manageReview?product_id=${id}`}
        variant="tertiary"
        icon={ViewIcon}
        onClick={()=>{onClick}}
        loading={loading}
        disabled={disabled}
      >
        View
      </Button>
    </Link>
  );
}
