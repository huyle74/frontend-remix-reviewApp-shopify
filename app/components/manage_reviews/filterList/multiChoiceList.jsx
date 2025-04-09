import { ChoiceList } from "@shopify/polaris";

export default function MultiChoiceList({ title }) {
  return <ChoiceList allowMultiple title={title} />;
}
