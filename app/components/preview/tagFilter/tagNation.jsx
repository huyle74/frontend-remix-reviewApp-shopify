import { Tag, Text } from "@shopify/polaris";

const colors = [
  "#b7950b",
  "#117a65",
  "#FF5733",
  "#C70039",
  "900C3F",
  "#2980b9",
  "#34495e",
  "#6c3483",
];

export default function TagNation({ nation }) {
  let color = 0;
  return (
    <div
      style={{
        padding: `${nation.length ? "0.5rem 0 0.5rem 0" : ""}`,
        display: "flex",
        flexWrap: "wrap",
      }}
    >
      {nation.length !== 0 && <Text fontWeight="bold">Country:</Text>}
      {nation.length !== 0 &&
        nation.map((el, index) => {
          const checkNationExist = nation.some((item) => el === item);
          if (checkNationExist) {
            color++;
            color = color === colors.length ? (color = 0) : color;
            return (
              <div
                key={index}
                style={{ margin: "0 0.2rem 0 0.2rem", display: "flex" }}
              >
                <Tag>
                  <p
                    style={{
                      fontWeight: 700,
                      color: `${colors[color]}`,
                    }}
                  >
                    {el}
                  </p>
                </Tag>
              </div>
            );
          }
        })}
    </div>
  );
}
